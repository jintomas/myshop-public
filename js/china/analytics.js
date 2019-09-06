analytics = {
  url: "/china/analytics"
};

$(document).ready(function() {
  analytics.initializePages();

  analytics.before(ubsApp, "restartGame", () => {
    monopoly.renderPageforBoard(analytics.pages.Login);
    return false;
  });

  $("#monopolyBase, #templateContent, #helpContent").on(
    "click",
    eventObject => {
      let eventTarget = eventObject.target;
      let key = eventTarget.id || eventTarget.className;
      console.log(key);
    }
  );
});

analytics.before = (object, method, callback) => {
  let originalMethod = object[method];
  object["old_" + method] = originalMethod;
  object[method] = function() {
    let shouldContinue = callback.apply(object, arguments);
    if (shouldContinue) {
      originalMethod.apply(object, arguments);
    }
  };
};

analytics.after = (object, method, callback) => {
  let originalMethod = object[method];
  object["old_" + method] = originalMethod;
  object[method] = function() {
    originalMethod.apply(object, arguments);
    callback.apply(object, arguments);
  };
};

analytics.initializePages = () => {
  analytics.pages = $.extend({}, analytics.origpages);
};

analytics.login = () => {
  let credentials = {
    username: $("#username").val(),
    password: $("#password").val()
  };

  $.post({
    url: analytics.url + "/login",
    data: JSON.stringify(credentials),
    contentType: "application/json; charset=utf-8",
    success: response => {
      eval(response);
    }
  });
};
