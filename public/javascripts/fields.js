/**
 * Copyright (C) 2014 yanni4night.com
 * fields.js
 *
 * changelog
 * 2014-09-14[18:00:02]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
! function() {

  function checkUrl(name, cb) {
    $.ajax({
      url: '/checkurlexist',
      data: {
        url: $('#checkUrl').text().trim().replace('{{name}}', name)
      },
      dataType: 'json'
    }).done(function(data) {
      cb(!!data.exist);
    });
  }

  if (window.checkUrl) {
    $('input[name="pageName"]').change(function(e) {
      var key = $(this).val().trim();
      key && checkUrl(key, function(exist) {
        console.log('exist', exist);
      });
    });
  }
}();


! function() {

  $('form').submit(function(e) {
    var err = false;
    $(this).find('input[type=text][data-type]').each(function(idx, input) {
      var v = $(input).val();
      switch($(input).attr('data-type')){
        case "word":
          if(!/^[\w-]+$/.test(v)){
            $(input).next('.tip').text('全为英文');
            err = true;
          }
          break;
        case "url":
          if(!/^https?:\/\/\w[\w-\.]+/.test(v)){
            $(input).next('.tip').text('需为链接');
            err = true;
          }
          break;
      }
    });
    if (err) {
      e.preventDefault();
      return false;
    }
  }).delegate('input','click',function(e){
    $(form).find('tip').empty();
  });

}();