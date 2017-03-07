var _ = require('./utils'),
    fs = require('fs')
    ;

var allDatas = {}
    ,defaultLang
    ,path
    ,pathFormat
    ,defaultTranslate
    ;

function getTranslater(lang) {
    var langDatas = allDatas[lang] || ( allDatas[lang] = {} ),
        langPath = path + pathFormat.replace(/\%\lang\%/g, lang);
    function loadLanguage(mod) {
        var path = langPath.replace(/\%module\%/g, mod), data = {};
        try {
            data = JSON.parse(fs.readFileSync(path));
            _.extend(true, langDatas, data);
        } catch (e){
            console.error('[WARN:LANG]-[LOADING:%s]',path);
            console.error(e);
        };
        langDatas[mod] || (langDatas[mod] = {});
    }
    return function(mod, str){
        str = str ? mod+'.'+str : mod;
        var keys = str.split('.');
        mod = keys.shift();
        if (!langDatas[mod]) {
            loadLanguage(mod);
        }
        var r = langDatas[mod];
        keys.forEach(function(it){
            r = r && r[it];
        })
        if (_.isObject(r) || _.isUndefined(r)){
            if (lang !== defaultLang) {
                return defaultTranslate(str);
            }
            return '['+str+']';
        }
        return r;
    }
}

module.exports = function(opts){
    opts || (opts = {});
    defaultLang = opts.defaultLanguage || 'en';
    var key = opts.key || '_lang',
        prefix = opts.prefix || '',
        languages = opts.languages || null,
        allTranslater = {};
    path = opts.path || (__dirname+'/lang');
    pathFormat = opts.pathFormat || '/%module%_%lang%.json';
    defaultTranslate = getTranslater(defaultLang);
    return function(req, res, next){
        var curLang = req.query[key] || req.body[key] || req.headers[key] || req.cookies[prefix+key] || defaultLang;
        res.tr =allTranslater[curLang] || (allTranslater[curLang] =
            getTranslater(_.isArray(languages) ? ( languages.indexOf(curLang) === -1 ? defaultLang : curLang) : curLang));
        next();
    }
}
