const { default: makeWASocket, useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys")
const pino = require("pino")
const fs = require("fs")
const useCODE = process.argv.includes("--useCODE")
const ffmpeg = require("fluent-ffmpeg")

let creds
try {
creds = JSON.parse(fs.readFileSync("./auth/creds.json"))
} catch(err) {
  creds = null
}
const cl = console.log
cl("=========================\n", "Pairing Code: " + useCODE + "\n=========================\n")

async function botWA() {
  const auth = await useMultiFileAuthState("auth")
  let browser
  if(!creds) {
    browser = useCODE ? ['Chrome (Linux)', 'SenStore', '5.1.9'] : ['SenStore', 'Opera', '5.1.9']
  } else {
  if(!creds.pairingCode || creds.pairingCode === "") {
    browser = ['SenStore', 'Opera', '5.1.9']
  } else {
    browser = ['Chrome (Linux)', 'SenStore', '5.1.9']
  }
}
  const socket = makeWASocket({
    printQRInTerminal: useCODE ? false : true,
    browser: browser,
    auth: auth.state,
    logger: pino({ level: "silent" }),
    generateHighQualityLinkPreview: true,
  })
  if(useCODE && !socket.user && !socket.authState.creds.registered) {
    const question = (pertanyaan) => new Promise((resolve) => {
      const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout})
    readline.question(pertanyaan, answer => { resolve(answer)
    readline.close()
    })
    })
    const nomorWa = await question("Masukan Nomor WhatsApp Anda: +")
    setTimeout(async function() {
    const pairingCode = await socket.requestPairingCode(nomorWa)
    cl("Kode Pairing:", pairingCode)
  }, 3000)
  }
  socket.ev.on("creds.update", auth.saveCreds)
  socket.ev.on("connection.update", ({ connection }) => {
    if(connection === "open") console.log("[ ✓ ] Sudah Terkoneksi ke nomor: +" + socket.user.id.split(":")[0] + "\n")
    if(connection === "open") cl("≟ Device Detail :")
    if(connection === "open") cl("≛ ", browser)
    if(connection === "close") console.log("[ ✖ ] Koneksi Terputus! Menyambungkan Ulang...")
    if(connection === "close") botWA()
  })
  socket.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    function reply(text) {
      socket.sendMessage(msg.key.remoteJid, {text: text}, { quoted: msg })
    }
    /*cl(msg)*/
    if(!msg.message) return
    const msgNumber = msg.key.remoteJid.split("@")[0]
    const msgSender = msg.pushName
    const msgType = Object.keys(msg.message)[0]
    const msgText = msgType === "conversation" ? msg.message.conversation : msgType === "extendedTextMessage" ? msg.message.extendedTextMessage.text : msgType === "imageMessage" ? msg.message.imageMessage.caption : ""
    if(!msgText.startsWith(".")) return
    cl(`==================================================\n• Tipe Pesan: ${msgType}\n• Nomor Pengirim: +${msgNumber}\n• Nama Pengirim: ${msgSender}\n• Isi Pesan: ${msgText}`)
    const cmd = msgText.replace(/^\./g, "")
    cl(`• Perintah: ${cmd}\n==================================================\n#`)
    const id = msg.key.remoteJid
    switch (cmd.toLowerCase()) {
      case "s": case "sticker":
        reply("Sedang Proses Pembuatan, Sabar...")
        const buffer = await downloadMediaMessage(msg, "buffer", {}, {logger: pino})
        fs.writeFileSync("./src/sticker.png", buffer)
        
        const createSticker = () => {
         return new Promise((resolve, rejects) => { ffmpeg("./src/sticker.png")
        .format("webp")
        .outputOptions(
          "-vcodec",
          "libwebp",
          "-vf",
          "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split[a][b]; [a] palettegen=reserve_transparent=on :transparency_color=ffffff [p]; [b][p] paletteuse")
        .on("error", (err) => rejects(err))
        .on("end", () => resolve("./src/sticker.webp"))
        .save("./src/sticker.webp")
        })
        }
        const sticker = await createSticker()
        await socket.sendMessage(id, { sticker: { url: sticker, author: 'By SenR', packname: 'Sticker Dibuat Oleh LuLu Bot.' } }, { quoted: msg }
        );
        ["./src/sticker.png", "./src/sticker.webp"].forEach(fileName => 
          fs.rmSync(fileName)
          )
          reply("Pembuatan Selesai !")
        break
      case "nomor": case "owner": case "creator":
        reply("https://wa.me/628975626924\n*NOTE*\nJANGAN kirim spam,virtex,apk gajelas,link phising. dan JANGAN telepon kalo gaada urusan penting.")
        break
      case "animasi":
        reply("_*Mengambil data*_...")
          socket.sendMessage(id, { video: fs.readFileSync("./video.mp4"), mimeType: "video/mp4"}, { quoted: msg })
        break
      case "gifanimasi":
        reply("_*Mengambil data*_...")
        socket.sendMessage(id, { video: fs.readFileSync("./video.mp4"), mimeType: "video/mp4", gifPlayback: true}, { quoted: msg })
        break
      case "menu":
        reply("_*Mengambil data*_...")
          socket.sendMessage(id, { image: { url: "./thumbnail.jpg"}, mimeType: "image/jpg"}, { quoted: msg })
        break
      case "sc": case "sourcecode": case "script":
        reply("_*Mengambil data*_...")
        reply("Jika ingin tau sc nya, dateng aja ke:\nhttps://github.com/SenRyhn\n\n*NOTE*\n• Semua yang ada disitu gratis...\n• Jika ada yang memperjual-belikan sc ini, lapor ke gw.")
        break
      case "bleb":
        reply("Bleb?")
        break
    }
  })
  // Console Log *NOTE* Made By SenR //
  cl("_____________________________\n❐ Script di buat oleh: SenR.\n❐ My GitHub: https://github.com/SenRyhn\n❐ Recode? Kasih Credit Sat!\n❐ Terima Kasih udah mau pake sc ini\n_____________________________\n")
  cl(`[ ! ] DISCLAIMER Untuk pengguna panel.\nJika ingin menggunakan pairing code, di File "package.json",\n➥ (start: "node index") di ganti jadi\n➥ (start: "node index --useCODE")\n`)
  cl("[ Memuat Kode... ]\n")
  // ~ //
}

botWA()