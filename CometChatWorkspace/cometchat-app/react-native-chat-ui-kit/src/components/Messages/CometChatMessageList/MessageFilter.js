import * as enums from '../../../utils/enums';
export default class MessageFilter {
  categories = {};

  types = null;

  constructor() {
    this.categories = {
      [enums.CATEGORY_MESSAGE]: enums.CATEGORY_MESSAGE,
      [enums.CATEGORY_CUSTOM]: enums.CATEGORY_CUSTOM,
      [enums.CATEGORY_ACTION]: enums.CATEGORY_ACTION,
      [enums.CATEGORY_CALL]: enums.CATEGORY_CALL,
    };

    this.types = {
      [enums.MESSAGE_TYPE_TEXT]: enums.MESSAGE_TYPE_TEXT,
      [enums.MESSAGE_TYPE_IMAGE]: enums.MESSAGE_TYPE_IMAGE,
      [enums.MESSAGE_TYPE_VIDEO]: enums.MESSAGE_TYPE_VIDEO,
      [enums.MESSAGE_TYPE_AUDIO]: enums.MESSAGE_TYPE_AUDIO,
      [enums.MESSAGE_TYPE_FILE]: enums.MESSAGE_TYPE_FILE,
      [enums.CUSTOM_TYPE_POLL]: enums.CUSTOM_TYPE_POLL,
      [enums.CUSTOM_TYPE_STICKER]: enums.CUSTOM_TYPE_STICKER,
      [enums.ACTION_TYPE_GROUPMEMBER]: enums.ACTION_TYPE_GROUPMEMBER,
      [enums.CALL_TYPE_AUDIO]: enums.CALL_TYPE_AUDIO,
      [enums.CALL_TYPE_VIDEO]: enums.CALL_TYPE_VIDEO,
    };
  }

  getCategories = () => {
    return Object.keys(this.categories);
  };

  getTypes = () => {
    return Object.keys(this.types);
  };
}
