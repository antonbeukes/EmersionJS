function init(object, element, templateId) {
    var templatePath = "templates/" + templateId + ".emr";
    var templateHTML;
    ajax.get(templatePath, '', function(data) {templateHTML = replaceTemplateText(object,data);}, false);
    replaceTemplateText(object,templateHTML)
    element.innerHTML = templateHTML;

    var emersionElements = element.querySelectorAll('[em]');
    for (var i = 0; i < emersionElements.length; i++) {

        var funcText = emersionElements[i].getAttribute("em");
        emersionElements[i].removeAttribute("em")

        var func = praseFunction(funcText, funcText)
        if (func.command == "forEach") {

            var curObject = object;
            if (func.objectName != ":model") {
                curObject = object[func.objectName];
            }
            /////////////////////////////////////////////
            curObject.forEach(function(item, index) {
                var tempElement = document.createElement("item");
                init(item, tempElement, func.template)


                while (tempElement.children.length > 0) {
                    var eventElement = tempElement.children[0];
                     emersionElements[i].appendChild(eventElement)
                }

            });
        }
        else if(func.command == "ifHas") {
          var curObject = object;
          if (func.objectName != ":model") {
              curObject = object[func.objectName];
          }

          var tempElement = document.createElement("item");

          if (has(curObject,func.name)) {
            func.template = func.template.substring(0,func.template.indexOf(":"))
            ;
          }
          else {
            func.template = func.template.substring(func.template.indexOf(":") + 1)
          }
            init(curObject, tempElement, func.template);
          while (tempElement.children.length > 0) {
              var eventElement = tempElement.children[0];
              emersionElements[i].appendChild(eventElement)
          }

          ///////////////////////////////////

        }

    }
}

function domify(str) {
    var el = document.createElement('div');
    el.innerHTML = str;
    return el;
}

function replaceTemplateText(object, templateText) {
  console.log('-------------------------------------------');
    var rxp = /{([^}]+)}/
    var curMatch;
    //find functions
    while (curMatch = rxp.exec(templateText)) {
      console.log(curMatch);
        if (curMatch[1] == ":model") {
            templateText = templateText.replace(curMatch[0], object.toString())
        } else {
            templateText = templateText.replace(curMatch[0], object[curMatch[1]])
        }
    };
      console.log('-------------------------------------------');
    return templateText;
}




function praseFunction(text) {
    var func = {
        text: "",
        command: "",
        objectName: "",
        name: "",
        template: ""
    };
    func.text = text;
    func.command = func.text.substring(0, (func.text.indexOf("(")));
    func.objectName = func.text.substring(func.text.indexOf("(") + 1, func.text.indexOf(")"));
    var tempString = func.text.substring(func.text.indexOf(" ") + 1);
    func.name = tempString.substring(0, tempString.indexOf(" "));
    func.template = tempString.substring(tempString.indexOf(" ") + 1, tempString.length);
    return func;
}

function has(object, key) {
    return object ? hasOwnProperty.call(object, key) : false;
}
