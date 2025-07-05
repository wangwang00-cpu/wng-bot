/**
   * Create By Anantha 
   * Contact Me on wa.me/6285168873528
   * Follow Instagram me @vaenspedia_id
   * Address me Bali, Gianyar, Sukawati 
**/
require('./owner-dan-menu')
const makeWASocket = require("@whiskeysockets/baileys").default
const { uncache, nocache } = require('./lib/loader')
const { color, bgcolor } = require('./lib/color')
const { welcomeCard } = require("greetify");
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: AnanthaGanzConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`src/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000);
const { isSetClose,
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
    checkSewaGroup
} = require("./lib/store")

let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let _left = JSON.parse(fs.readFileSync('./database/left.json')); 
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let setpay = JSON.parse(fs.readFileSync('./database/pay.json'));
let opengc = JSON.parse(fs.readFileSync('./database/opengc.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let antilink2 = JSON.parse(fs.readFileSync('./database/antilink2.json'));
let antiwame2 = JSON.parse(fs.readFileSync('./database/antiwame2.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));
require('./store.js')
nocache('../store.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
require('./AnanthaGanz.js')
nocache('../AnanthaGanz.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

//------------------------------------------------------
let phoneNumber = "6285168873528"
let owner = global.owner

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

const store = {
  contacts: new Map(),
  chats: new Map(),
  messages: new Map(),
  saveMessage(jid, id, message, expireMs = 1 * 24 * 60 * 60 * 1000) { 
    if (!jid || !id || !message) return false;
    if (!this.messages.has(jid)) this.messages.set(jid, new Map());
    const msgs = this.messages.get(jid);
    if (msgs.has(id)) clearTimeout(msgs.get(id).timer);
    msgs.set(id, {
      data: message,
      timer: setTimeout(() => {
        msgs.delete(id);
        if (!msgs.size) this.messages.delete(jid);
      }, expireMs),
      savedAt: Date.now()
    });
    return true;
  },
  loadMessage(jid, id) {
    return this.messages.get(jid)?.get(id)?.data;
  },
  hasMessage(jid, id) {
    return !!this.messages.get(jid)?.has(id);
  },
  deleteMessage(jid, id) {
    const msgs = this.messages.get(jid);
    if (!msgs?.has(id)) return false;
    clearTimeout(msgs.get(id).timer);
    msgs.delete(id);
    if (!msgs.size) this.messages.delete(jid);
    return true;
  },
  flushMessages() {
    this.messages.forEach(msgs => msgs.forEach(m => clearTimeout(m.timer)));
    this.messages.clear();
  }
};

async function startAnanthaGanz() {
let { version, isLatest } = await fetchLatestBaileysVersion()
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
    const AnanthaGanz = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !pairingCode, // popping up QR in terminal log
    mobile: useMobile, // mobile api (prone to bans)
    browser: [ "Windows", "Edge", "92.0" ], // Windows with Edge
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true, // set false for offline
    generateHighQualityLinkPreview: true, // make high preview link
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)

        return msg?.message || ""
    },
    msgRetryCounterCache, // Resolve waiting messages
    defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
})
   

    // login use pairing code
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !AnanthaGanz.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile api')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +62xxx")))
            process.exit(0)
         }
      } else {
         phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number \nFor example: +62xxx : `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')


      }

      setTimeout(async () => {
         let code = await AnanthaGanz.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
      }, 3000)
   }
   
   

AnanthaGanz.ev.on('connection.update', async (update) => {
	const {
        
		connection,
		lastDisconnect
	} = update
try{
		if (connection === 'close') {
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.badSession) {
				console.log(`Bad Session File, Please Delete Session and Scan Again`);
				startAnanthaGanz()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				startAnanthaGanz();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				startAnanthaGanz();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				startAnanthaGanz()
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
				startAnanthaGanz();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				startAnanthaGanz();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				startAnanthaGanz();
			} else AnanthaGanz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
		}
		if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
			console.log(color(`\nConnecting...`, 'white'))
		}
		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
			console.log(color(` `,'magenta'))
            console.log(color(`Connected to => ` + JSON.stringify(AnanthaGanz.user, null, 2), 'green'))
			await delay(1999)
       const CFonts = require('cfonts');
CFonts.say('ZANNSTORE', {
  font: '3d',              // Jenis font
  align: 'left',            // Posisi teks (left, center, right)
  colors: ['green', 'white'],    // Warna teks
  background: 'transparent',  // Warna latar belakang
  letterSpacing: 1,           // Spasi antar huruf
  lineHeight: 1,              // Tinggi baris
  space: true,                // Spasi antar karakter
  maxLength: '0',             // Panjang maksimal teks (0 untuk tidak dibatasi)
});

     
            
            console.log('> Terkoneksi Ke Bot < [ ! ]')
		}
	
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  startAnanthaGanz();
	}
})
AnanthaGanz.ev.on('creds.update', saveCreds)
AnanthaGanz.ev.on("messages.upsert",  () => { })
//------------------------------------------------------


// Anti Call
    
    //autostatus view
        AnanthaGanz.ev.on('messages.upsert', async chatUpdate => {
        	if (global.antiswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            	await AnanthaGanz.readMessages([mek.key]) }
            }
    })
   
            
    AnanthaGanz.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!AnanthaGanz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('BAE5')) return
            m = smsg(AnanthaGanz, mek, store)
            require("./store")(AnanthaGanz, m, chatUpdate, store, opengc, setpay, antilink, antiwame, antilink2, antiwame2, set_proses, set_done, set_open, set_close, sewa, db_respon_list)
        } catch (err) {
            console.log(err)
        }
    })
    async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Hai Im juna Bot"
        }
    }
    setInterval(() => {
        for (let i of Object.values(opengc)) {
            if (Date.now() >= i.time) {
                AnanthaGanz.groupSettingUpdate(i.id, "not_announcement")
                .then((res) =>
                AnanthaGanz.sendMessage(i.id, { text: `Sukses, group telah dibuka` }))
                .catch((err) =>
                AnanthaGanz.sendMessage(i.id, { text: 'Error' }))
                delete opengc[i.id]
                fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            }
        }
    }, 1000)   
    AnanthaGanz.ev.on('group-participants.update', async (anu) => {
    const isWelcome = _welcome.includes(anu.id);
    const isLeft = _left.includes(anu.id);

    try {
        let metadata = await AnanthaGanz.groupMetadata(anu.id);
        let participants = anu.participants;
        const groupName = metadata.subject;
        const groupDesc = metadata.desc;

        for (let num of participants) {
            let ppuser, ppgroup;

            try {
                ppuser = await AnanthaGanz.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
            }

            try {
                ppgroup = await AnanthaGanz.profilePictureUrl(anu.id, 'image');
            } catch {
                ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
            }

            if (anu.action == "add" && isWelcome == true) {
                if (isSetWelcome(anu.id, set_welcome_db)) {
                    var get_teks_welcome = await getTextSetWelcome(anu.id, set_welcome_db);
                    var replace_pesan = get_teks_welcome.replace(/@user/gi, `@${num.split('@')[0]}`);
                    var full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
                    await AnanthaGanz.sendMessage(anu.id, {
                        image: { url: ppuser },
                        mentions: [num],
                        caption: full_pesan
                    });
                } else {
                    await AnanthaGanz.sendMessage(anu.id, {
                        image: { url: ppuser },
                        mentions: [num],
                        caption: `Halo @${num.split("@")[0]}, Welcome To ${groupName}`,
                    });
                }
            } else if (anu.action == "remove" && isLeft == true ) {
                if (isSetLeft(anu.id, set_left_db)) {
                    var get_teks_left = await getTextSetLeft(anu.id, set_left_db);
                    var replace_pesan = get_teks_left.replace(/@user/gi, `@${num.split('@')[0]}`);
                    var full_pesan = replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc);
                    await AnanthaGanz.sendMessage(anu.id, {
                        image: { url: ppuser },
                        mentions: [num],
                        caption: full_pesan,
                    });
                } else {
                    await AnanthaGanz.sendMessage(anu.id, {
                        image: { url: ppuser },
                        mentions: [num],
                        caption: `Sayonara @${num.split("@")[0]}`,
                    });
                }
            } else if (anu.action == "promote") {
                await AnanthaGanz.sendMessage(anu.id, {
                    image: { url: ppuser },
                    mentions: [num],
                    caption: `@${num.split("@")[0]} sekarang menjadi admin grup ${groupName}`,
                });
            } else if (anu.action == "demote") {
                await AnanthaGanz.sendMessage(anu.id, {
                    image: { url: ppuser },
                    mentions: [num],
                    caption: `@${num.split("@")[0]} bukan admin grup ${groupName}`,
                });
            }
        }
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
    }
});
AnanthaGanz.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                if (toCmd == undefined) return
	                global.prefix = prefix
                    var prefCmd = prefix+toCmd
	                AnanthaGanz.appenTextMessage(prefCmd, chatUpdate)
				}
			}
		}
    })
   
    AnanthaGanz.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    AnanthaGanz.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = AnanthaGanz.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    AnanthaGanz.getName = (jid, withoutContact = false) => {
        id = AnanthaGanz.decodeJid(jid)
        withoutContact = AnanthaGanz.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = AnanthaGanz.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === AnanthaGanz.decodeJid(AnanthaGanz.user.id) ?
            AnanthaGanz.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

AnanthaGanz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await AnanthaGanz.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await AnanthaGanz.getName(i)}\nFN:${await AnanthaGanz.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
	    })
	}
	AnanthaGanz.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    AnanthaGanz.public = true

    AnanthaGanz.serializeM = (m) => smsg(AnanthaGanz, m, store)

    AnanthaGanz.sendText = (jid, text, quoted = '', options) => AnanthaGanz.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    AnanthaGanz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await AnanthaGanz.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    AnanthaGanz.sendTextWithMentions = async (jid, text, quoted, options = {}) => AnanthaGanz.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    AnanthaGanz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await AnanthaGanz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

AnanthaGanz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await AnanthaGanz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
    AnanthaGanz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    
    AnanthaGanz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await AnanthaGanz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}
    
    AnanthaGanz.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return AnanthaGanz.sendMessage(jid, { poll: { name, values, selectableCount }}) }

AnanthaGanz.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
            
    AnanthaGanz.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return AnanthaGanz
}

startAnanthaGanz()

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})