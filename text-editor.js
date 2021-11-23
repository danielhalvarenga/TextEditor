var CDEditor = function(textarea){
    this.textarea = textarea;
    var textareaSource = null;
    var self = this;
    var toolbar = [];

    var init = function(){
        textareaSource = document.querySelector(self.textarea);
        textareaSource.style.display = 'none';
        container = textareaSource.parentElement;
        initToolbar(toolbar);
        initIframe(container, textareaSource);
    }
    var fonts = ['Arial', 'Calibri', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Times New Roman'];
    var sizes = [1, 2, 3, 4, 5, 6, 7];
    var colors = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
        '#0000FF', '#00FF00', '#FF0000', '#00FFFF', '#FFFF00', '#FF00FF'
    ];

    // Salvar arquivo como PDF
    this.save = function(){
        textareaSource.value = CDEditorIframe.document.body.innerHTML;
        // var doc = new jsPDF();
        var doc = new jsPDF('portrait', 'pt', 'a4');
        doc.fromHTML(CDEditorIframe.document.body.innerHTML)
        var titulo = 'Meu Projeto.pdf';

        if(document.getElementById("titulo").value != null && document.getElementById("titulo").value != ''){
            titulo = `${document.getElementById("titulo").value}.pdf`;
        }
        doc.save(titulo) 
    }

var initToolbar = function (toolbar) {
    // Botão marca texto
    var highlighter = new ComponentButton('backColor', '/icons/marker.png');
    highlighter.recoverValue = function () {
        return selectedNode().style.backgroundColor === 'yellow' ? 'white' : 'yellow';
    };
    
    var ComponentSelect = function (commandName, values, selected) {
        // var div = document.createElement('div');
        // div.classList.add('col-md-1');
        var select = document.createElement('select');
        // select.classList.add('form-select');
        // select.classList.add('col-md-1');
        values.forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            if(selected != null && value == selected){
                option.selected = true;
            }
            option.appendChild(document.createTextNode(value));
            select.appendChild(option);
            // div.appendChild(select)
        });

        Component.call(this, commandName, select, 'change');

        var selfComponentSelect = this;
        this.recoverValue = function () {
            return selfComponentSelect.element.firstChild.value;
        };
    };

    //FONTCOLOR MENU
    var fontColor = new ComponentSelect('forecolor', colors);
    Array.from(fontColor.element.firstChild.options).forEach(function (option) {
        option.style.color = option.value;
    });
    fontColor.element.firstChild.style.color = Array.from(fontColor.element.firstChild.options)[0].value;
    fontColor.recoverValue = function () {
        fontColor.element.firstChild.style.color = fontColor.element.firstChild.value;
        return fontColor.element.firstChild.value;
    };

    // LINK BUTTON
    var link = new ComponentButton('createLink', 'icons/link.png');
    link.recoverValue = function () {
        var valor = prompt('Entre com o endereço do link:');
        if(valor == null && valor != ''){
            return null;
        }
        return selectedNode().link = valor;
    };
    
    // var unlink = new ComponentButton('unlink', 'icons/unlink.png');
    // unlink.recoverValue = function () {
    //     return selectedNode().removeAttribute('href');
    // };

    // var bold = new ComponentButton('bold', 'icons/bold.png');
    // var italic = new ComponentButton('italic', 'icons/italic.png');
    // var alignright = new ComponentButton('justifyright', 'icons/align-left.png');
    // new ComponentButton('justifycenter', 'align-center'),
    // new ComponentButton('justifyright', 'align-right'),
    // new ComponentButton('justifyfull', 'align-justify'),
    

    toolbar.push(
        new ComponentSelect('fontname', fonts),
        new ComponentSelect('fontsize', sizes, 3),
        fontColor,
        new Space(),
        new ComponentButton('bold', 'icons/bold.png'),
        new ComponentButton('italic', 'icons/italic.png'),
        new ComponentButton('underline', 'icons/underline.png'),
        // new ComponentButton('strikethrough', 'strikethrough'),
        new Space(),
        // alignright,
        new ComponentButton('justifyright', 'icons/align-right.png'),
        new ComponentButton('justifyleft', 'icons/align-left.png'),
        new ComponentButton('justifycenter', 'icons/align-center.png'),
        new ComponentButton('justifyfull', 'icons/align-justify.png'),
        new Space(),
        link,
        new ComponentButton('unlink', 'icons/unlink.png'),
        new Space(),
        highlighter,
        // new Space(),
        // new ComponentButton('insertOrderedList', 'list-ol'),
        // new ComponentButton('insertUnorderedList', 'list-ul')
    );

    renderToolbar(toolbar);
};
// //     // }
    var ComponentButton = function (commandName, icon) {
        // var button = document.createElement('button');
        var buttonIcon = document.createElement('img');
        // buttonIcon.width = '14px';
        // buttonIcon.height = '14px';
        buttonIcon.src = icon;
        // button.appendChild(buttonIcon);
        Component.call(this, commandName, buttonIcon, 'click');
    };

    var Component = function (commandName, element, event) {
        this.commandName = commandName;
        this.element = document.createElement('li');
        this.element.appendChild(element);
        this.recoverValue = function () {
            return null;
        };

        var selfComponent = this;
        this.element.addEventListener(event, function () {
            CDEditorIframe.document.execCommand(commandName, false, selfComponent.recoverValue());
        });

    };

    var Space = function () {
        this.element = document.createElement('li');
        this.element.classList.add('space');
        // this.element.innerHTML = '&nbsp;';
    };

    var selectedNode = function () {
        return CDEditorIframe.getSelection().anchorNode.parentNode;
    };

    var renderToolbar = function (toolbar) {
        var list = document.createElement('ul');
        list.classList.add('cd-toolbar');

        toolbar.forEach(function (component) {
            list.appendChild(component.element);
        });

        document.getElementById('container-toolbar').appendChild(list);
    };

    var initIframe = function(container, textareaSource){
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'about:blank');
        iframe.setAttribute('contenteditable', 'true');
        iframe.setAttribute('id', 'CDEditorIframe');
        iframe.setAttribute('name', 'CDEditorIframe');
        iframe.setAttribute('style', 'width: 100%')

        container.appendChild(iframe);
        CDEditorIframe.document.body.innerHTML = textareaSource.value;
        CDEditorIframe.document.body.setAttribute('style','font-family: Arial');
        CDEditorIframe.document.designMode = 'on';
        CDEditorIframe.document.body.style.margin = 0;
        CDEditorIframe.document.body.style.wordWrap = 'break-word';
        // CDEditorIframe.document.body.id = 'capture';
    }
    init();
};