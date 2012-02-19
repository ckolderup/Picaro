define(["jquery", "util", "inventory", "action_guard", "vendor/underscore"], function($, Util, Inventory, ActionGuard) {
  var Item = {
    init: function(items) {
      this.allById = items;
    },

    findByRoom: function(room) {
      return _.filter(this.allById, function(item, id) { return item.location === room.name })
    },

    look: function(item) {
      $(document).trigger("updateStatus", item.look[item.lookNum]);
      if(item.look.length > (item.lookNum + 1)){
        item.lookNum += 1;
      }
    },

    talk: function(item) {
      $(document).trigger("updateStatus", item.talk[item.talkNum]);
      if(item.talk.length > (item.talkNum + 1)){
        item.talkNum += 1;
      }
    },

    attack: function(item) {
      $(document).trigger("updateStatus", item.attack[item.attackNum]);
      if(item.attack.length > (item.attackNum + 1)){
        item.attackNum += 1;
      }
    },

    take: function(item) {
      Inventory.add(item);
      $(document).trigger('itemTaken', item)
      $(document).trigger('closeMenu');
      if (item.take.after) $(document).trigger('gameEvent', item.take)
    },

    tryToTake: function(item) {
      if (this.canTake(item)) {
        this.take(item)
      } else {
        this.willNotTake(item)
      }
    },

    canTake: function(item) {
      if (item.take == true) {
        return true
      } else if (item.take && item.take.actionGuard) {
        return ActionGuard.test(item.take)
      } else {
        return false
      }
    },

    willNotTake: function(item) {
      var message = "You can't take the " + item.name + ". ";
      if (item.take && item.take.cannotTakeMessage) {
        message += item.take.cannotTakeMessage
      }
      $(document).trigger("updateStatus", message);
    },

    immediateTake: function(gameEvent) {
      var item = Item.allById[gameEvent.item]
      Item.take(item)
    },

    // This is non-commutative right now- item1 is used ON item2, which is expecting item1 to be used on it.
    use: function(itemId1, itemId2) {
      var item1 = this.allById[itemId1],
          item2 = this.allById[itemId2];

      if (item1 && item2 && item2.use && item2.use[item1.id]) {
        var using = item2.use[item1.id];
        $(document).trigger('gameEvent', using)
        if (using.after) {
          $(document).trigger('gameEvent', using)
        }
      } else {
        $(document).trigger("updateStatus", "You can't use those things together.")
        console.log("you can't use this on that.", item1, item2)
      }
    }

  };

  $(document).bind("actionTalk", function(e, o) {
    Item.talk(o)
  })

  $(document).bind("actionAttack", function(e, o) {
    Item.attack(o)
  })

  $(document).bind("actionLook", function(e, o) {
    Item.look(o)
  })

  $(document).bind("actionUse", function(e, item1, item2) {
    Item.use(item1, item2)
  })

  $(document).bind("actionTake", function(e, o) {
    Item.tryToTake(o)
  })

  $(document).bind("immediateTake", function(e, o) {
    Item.immediateTake(o)
  })

  return Item;
});