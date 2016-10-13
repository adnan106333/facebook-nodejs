//
// var config = { };
//
// // should end in /
// config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:3000/';
//
// config.facebook = {
//     appId:          process.env.FACEBOOK_APPID          || '149597832165953',
//     appSecret:      process.env.FACEBOOK_APPSECRET      || 'd9103feb24841fc1b5c82ce9b1d08c32',
//     appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'fbnodejsnamespace',
//     redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
// };
//
// module.exports = config;


var config = { };

//should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://facebook-nodejs.herokuapp.com/';

config.facebook = {
   appId:          process.env.FACEBOOK_APPID          || '150205908771812',
   appSecret:      process.env.FACEBOOK_APPSECRET      || 'f3eaf1cc57033e69cba01824742f3016',
   appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'videoappadnan',
   redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;
