const mongoose = require('mongoose');
//тестовая валидация ссылки
// const isImageUrl = require('is-an-image-url');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true,
    // validate: {
    //   validator: function(url) {
    //     isImageUrl(url, (result) => {
    //       return result;
    //     })
    //   },
    //   message: 'Невалидный url для аватара.'
    // }
  }
})

module.exports = mongoose.model('user', userSchema);