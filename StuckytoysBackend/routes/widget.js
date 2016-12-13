/**
 * Created by jovi on 11/13/2016.
 */
var mongoose = require('mongoose');
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var multi = require('connect-multiparty');

var config = require('../config/config');
var Widget = mongoose.model('Widget');
var WidgetFile = mongoose.model('WidgetFile');

/*configuring DEPS*/
var auth = jwt({secret: config.secret,userProperty: config.userProperty});
var mp = multi();

/*API PARAMS*/
router.param('widgetFile', function(req, res, next, id)
{
  var query = WidgetFile.findById(id);
  query.exec(function(err, wfile) {
    if (err) {
      return next(err);
    }
    if (!wfile) {
      return next(new Error('Kan de gekozen file niet vinden.'));
    }
    req.widgetFile = wfile;
    return next();
  });
});
router.param('widget', function(req, res, next, id)
{
  var query = Widget.findById(id);
  query.exec(function(err, widget) {
    if (err) {
      return next(err);
    }
    if (!widget) {
      return next(new Error('Kan het gekozen widget niet vinden.'));
    }
    req.widget = widget;
    return next();
  });
});


/*API METHODS*/
router.post('/:widget/addFile', auth, mp, function(req, res, next)
{
  var query = {
    _id: req.widget._id
  };
  var w = Widget.findById(req.widget._id);
  w.widgetFiles.push(req.body.widgetFile);
  fs.readFile(req.files.file.path, function(err,data)
  {
    var fPath = path.join(__dirname, 'downloads', req.body.widgetFile.type, req.files.file.name);
    console.log(fPath);
    fs.writeFile(fPath, data, function(err)
    {
      return res.status(400).json({message: 'Upload failed'});
    });
  });
  Widget.update(query, w, {upsert: true}, function(err, doc)
  {
    if (err) return res.status(500).json({error: err});
    return res.send("succesfully saved");
  });
});

router.post('/:widget/removeFile/:widgetFile', auth, function(req, res, next)
{
  var query = {
    _id: req.widget._id
  };
  var id = req.widgetFile._id;
  WidgetFile.remove({ _id: req.widgetFile._id}, function(err)
  {
    if (!err)
    {
      req.widget.widgetFiles.forEach(function(entry) {
        if (entry._id === id) {
          var x = req.widget.widgetFiles.indexOf(entry);
          req.widget.widgetFiles.splice(x, 1);
        }
      });

      Widget.update(query, req.widget, {upsert: true}, function(err, doc)
      {
        if (err) return res.status(500).json({error: err});
        res.json(req.widget);
      });
    }
  });
});

router.post('/addWidget', auth, mp, function(req, res, next)
{
  if (!req.body.widgetFiles || !req.body.id) {
    return res.status(400).json({
      message: 'Vul alle velden in'
    });
  }
  var w = new Widget();
  w.widgetFiles = [];
  w.id = req.body.id;
  req.body.widgetFiles.forEach(function (widgetFile)
  {
    var f = new WidgetFile();
    f.fileName = widgetFile.fileName;
    f.type = widgetFile.type;
    fs.readFile(req.files.file.path, function(err,data)
    {
      var fPath = path.join(__dirname, 'downloads', f.type, req.files.file.name);
      console.log(fPath);
      fs.writeFile(fPath, data, function(err)
      {
        if (err) { return res.status(400).json({message: 'Upload failed'}); }
      });
    });
    f.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
    w.files.push(f);
  });
  w.save(function(err)
  {
    if(err){console.log(err);}
    res.json(w);
  });
});

router.get('/widgetTypes', auth, function (req, res, next)
{
    var path = __dirname + '/downloads/';
    fs.readdir(path, function (err, items)
    {
      res.json(items);
    });
  });

router.post('/widgetsOfType', auth, function (req, res, next)
{
    var path = __dirname + '/downloads/' + req.body.type;
    fs.readdir(path, function (err, items)
    {
      res.json(items);
    });
  });

router.get("/getAllWidgets", auth, function (req, res, next)
{
    Widget.find(function (err, widgets) {
      Widget.populate(widgets, {
        path: 'widgetFiles',
        model: 'WidgetFile'
      }, function (err, x) {
        res.json(x);
      });
    });
  });

router.post("/removeWidget/:widget", auth, function (req, res, next)
{
    Widget.remove({$_id: req.widget._id}, function (err)
    {
      if (!err) {
        res.json('fail');
      } else {
        res.json('succes');
      }
    });
  });

router.get("/widgets/:widget", auth, function (req, res, next)
{
    req.widget.populate('widgetFiles', function (err, file) {
      res.json(file);
    });
  });


module.exports = router;
