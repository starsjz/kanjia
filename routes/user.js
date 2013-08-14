
/*
 * GET users listing.
 */

exports.view = function(req, res){
  res.render('user', { userName: req.params.weixinUserName });
  console.log(req.weixinUserName);
};

exports.replay = function(req, res){
  res.render('replay',  { userName:  req.params.weixinUserName});
};