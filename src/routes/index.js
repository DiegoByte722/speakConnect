const router = require('express').Router();
const passport = require('passport');
const {Worker}= require('worker_threads');

router.get('/', (req, res) => {
  //const worker= new Worker('./src/routes/workerhora.js');
  //worker.postMessage('Hola desde el hilo principal');
  //recibir mensaje la hora del hilo secundario
  //worker.on('message',(msg) => {
  //console.log('MENSAJE RECIBIDO del hilo secundario: ' + msg);
  //});
  res.render('index');
});
//chat
router.get('/chat',isAuthenticated, (req, res, next) => {
  res.render('chat');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/chat',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/chat',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;
