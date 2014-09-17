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
        exist&&$(e.target).next('.tip').text('线上已存在');
      });
    });
  }
}();
