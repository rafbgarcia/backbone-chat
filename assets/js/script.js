$(function () {
  var messages = new Messages();
  var messagesView = new MessagesView({ el: $("#messages"), model: messages });
  var firstLoad = true;

  messages.on('all', function (e) {
    messagesView.render();

    var messagesEl = $('#messages'),
        body = $('body');

    if (e === 'sync' && firstLoad) {
      firstLoad = false;
    } else if (e === 'add' && !firstLoad) {
      if (!firstLoad && messagesEl.height() - body.scrollTop() < 700) {
        body.scrollTop(messagesEl.height());
      }
    }
  });

  new NewMessageView({ el: $('#new-message-form') })
});
