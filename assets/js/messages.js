var Messages = Backbone.Firebase.Collection.extend({
  url: 'https://vivid-heat-2302.firebaseIO.com/messages'
});


// Views

var MessageView = Backbone.View.extend({
  tagName: "li",
  className: function () {
    return this.model.get('user_id') === myUuid() ? 'mine' : 'theirs';
  },
  render: function () {
    var template = _.template($('#messageTmpl').html())({
      avatar: this.model.get('avatar'),
      body: this.model.get('body'),
      createdAt: moment(this.model.get('created_at')).fromNow(),
    });

    this.$el.html( template );

    return this;
  }
});

var MessagesView = Backbone.View.extend({
  model: Messages,

  render: function () {
    this.$el.html('');

    for (var i = 0; i < this.model.models.length; ++i) {
      var messageView = new MessageView({model: this.model.at(i)});

      this.$el.append(messageView.$el);

      messageView.render();
    }

    return this;
  }
});

var NewMessageView = Backbone.View.extend({
  events: {
    "submit form": "createMessage"
  },

  createMessage: function (event) {
    event.preventDefault();

    var message = {},
        form = $(event.currentTarget);

    _.forEach(form.serializeArray(), function (el) {
      message[el.name] = el.value;
    });

    message['avatar'] = myAvatar();
    message['user_id'] = myUuid();
    message['created_at'] = moment().toJSON();

    new Messages().push(message);

    form.find('button[type="reset"]').click();

    return false;
  }
});



var UUID_KEY = 'my_uuid';
var AVATAR_KEY = 'my_avatar';

function myUuid() {
  if (localStorage.getItem(UUID_KEY)) {
    return localStorage.getItem(UUID_KEY);
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  var uuid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

  localStorage.setItem(UUID_KEY, uuid);

  return uuid;
}



function myAvatar() {
  if (localStorage.getItem(AVATAR_KEY)) {
    return localStorage.getItem(AVATAR_KEY);
  }

  var avatar = 'assets/images/' + randomNumber() + '.png';
  localStorage.setItem(AVATAR_KEY, avatar);

  return avatar;
}



function randomNumber() {
  var max = 14,
      min = 1;

  return Math.floor(Math.random() * (max - min) + min);
}