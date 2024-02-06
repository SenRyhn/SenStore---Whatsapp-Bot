const { default: makeWASocket, useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys")
const pino = require("pino")
const fs = require("fs")
const thumb = fs.readFileSync("./thumbnail.jpg")
const thumbnail = fs.readFileSync("./thumbnail.jpg")
const useCODE = process.argv.includes("--useCODE")
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
    if(connection === "open") console.log("✓ Sudah Terkoneksi ke nomor: +" + socket.user.id.split(":")[0] + "\n")
    if(connection === "open") cl("Detail :")
    if(connection === "open") cl(browser)
    if(connection === "close") console.log("Terputus! Menyambungkan Ulang...")
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
      case "sticker": {
 if(!quoted) 
 reply(`Balas Video/Image Dengan Caption .sticker`)
if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await socket.sendImageAsSticker(from, media, m, { packname: "Stiker Dibuat Oleh LuLu Bot", author: "Buatan SenR" })
await fs.unlinkSync(encmedia)
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 11) return reply('Maksimal 10 detik!')
let media = await quoted.download()
let encmedia = await socket.sendVideoAsSticker(from, media, m, { packname: "Stiker Dibuat Oleh LuLu Bot", author: "Buatan SenR" })
await fs.unlinkSync(encmedia)
} else {
reply(`Kirim Gambar/Video Dengan Caption .sticker\nDurasi Video 1-9 Detik`)
}
}
break
      case "nomor": case "owner":
        reply("https://wa.me/62895359831246\n*NOTE*\nJANGAN kirim spam,virtex,apk gajelas,link phising. dan JANGAN telepon kalo gaada urusan penting.")
        break
      case "sc": case "sourcecode": case "creator":
        reply("_*Mengambil data*_...")
        reply("Jika ingin tau sc nya, dateng aja ke:\nhttps://github.com/SenRyhn\n\n*NOTE*\n• Semua yang ada disitu gratis...\n• Jika ada yang memperjual-belikan sc ini, lapor ke gw.\n\n_*(ketik .owner)*_")
        break
      case "animasi":
        reply("_*Mengambil data*_...")
          socket.sendMessage(id, { video: fs.readFileSync("./video.mp4"), mimeType: "video/mp4", caption: "Ini Bang, Keren Ga?"}, { quoted: msg })
        break
      case "gifanimasi":
        reply("_*Mengambil data*_...")
        socket.sendMessage(id, { video: fs.readFileSync("./video.mp4"), mimeType: "video/mp4", gifPlayback: true, caption: "Ini Bang, Keren Ga?"}, { quoted: msg })
        break
      case "menu":
        reply("_*Mengambil data*_...")
          socket.sendMessage(id, { image: { url: "./thumbnail.jpg"}, mimeType: "image/jpg"}, { quoted: msg })
        break
      case "sc":
        reply("_*Mengambil data*_...")
        reply("Jika ingin tau sc nya, dateng aja ke:\nhttps://github.com/SenRyhn\n\n*NOTE*\n• Semua yang ada disitu gratis...\n• Jika ada yang memperjual-belikan sc ini, lapor ke gw.")
        break
      case "bleb":
        reply("Bleb?")
        break
    }
  })
  // Console Log *NOTE* Made By SenR //
  cl("_____________________________\n• Script di buat oleh: SenR.\n• My GitHub: https://github.com/SenRyhn\n• Recode? Kasih Credit Sat!\n• Terima Kasih udah mau pake sc ini\n_____________________________\n")
  cl(`[ ! ] DISCLAIMER Untuk pengguna panel.\nJika ingin menggunakan pairing code, di File "package.json",\n(start: "node index") di ganti jadi\n(start: "node index --useCODE")\n`)
  cl("[ Memuat Kode... ]\n")
  // ~ //
}

botWA()
