"use strict";
require.cache[_dirname];
process.on("unhandledRejection", function(err) {
    console.log(require("util")["format"](err))
})

const{
    default: makeWASocket,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    Browsers,
    msgRetryCounterMap,
    DisconnectReason,
    makeInMemoryStore,
} = require("adiwajshing/baileys");
const pino = require('pino')
const fs = require("fs")
const useCODE = process.argv.includes("--useCODE")
const ffmpeg = require("fluent-ffmpeg")
const cl = console.log

async function botSStore(path) {
    try {
        creds = JSON.parse(fs.readFileSync("./auth/creds.json"))
    } catch(err) {
        cl(require("util")["format"](err))
    }
    const{sesi, auth, session} = await useMultiFileAuthState("session")
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
  const{conn, connect, socket} = makeWASocket({
    printQRInTerminal: useCODE ? false : true,
    browser: browser,
    sesi: sesi.state,
    logger: pino({ level: "silent" }),
    generateHighQualityLinkPreview: true,
  })
  if(useCODE && !conn.user && !conn.authState.creds.registered) {
    const question = (pertanyaan) => new Promise((resolve) => {
      const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout})
    readline.question(pertanyaan, answer => { resolve(answer)
    readline.close()
    })
    })
    const nomorWa = await question("Masukan Nomor WhatsApp Anda: +")
    setTimeout(async function() {
    const pairingCode = await conn.requestPairingCode(nomorWa)
    cl("Kode Pairing:", pairingCode)
  }, 3000)
  }
  conn.ev.on("creds.update", auth.saveCreds)
  conn.ev.on("connection.update", ({ connection }) => {
    if(connection === "open") console.log("[ ✓ ] Sudah Terkoneksi ke nomor: +" + socket.user.id.split(":")[0] + "\n")
    if(connection === "open") cl("≟ Device Detail :")
    if(connection === "open") cl("≛ ", browser)
    if(connection === "close") console.log("[ ✖ ] Koneksi Terputus! Menyambungkan Ulang...")
    if(connection === "close") botSStore("database/session")
  })
connect.ev.on("messages.upsert", async ({ messages }) => {
    const{m, msg, message} = messages[0]
    function reply(text) {
      connect.sendMessage(messages.key.remoteJid, {text: text}, { quoted: m })
    }
})
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
//END//=======================================================================================>>
cl("_____________________________\n• Script di buat oleh: SenR.\n• My GitHub: https://github.com/SenRyhn\n• Recode? Kasih Credit Sat!\n• Terima Kasih udah mau pake sc ini\n_____________________________\n")
cl(`[ ! ] DISCLAIMER Untuk pengguna panel.\nJika ingin menggunakan pairing code, di File "package.json",\n(start: "node index") di ganti jadi\n(start: "node index --useCODE")\n`)
cl("[ Memuat Kode... ]\n")
}
botSStore("database/session")
