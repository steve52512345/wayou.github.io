(function(a){var s=a.util.clone(a.languages.javascript);a.languages.jsx=a.languages.extend("markup",s);a.languages.jsx.tag.pattern=/<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;a.languages.jsx.tag.inside["attr-value"].pattern=/=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;a.languages.insertBefore("inside","attr-value",{script:{pattern:/=(\{[\w\W]*?\})/i,inside:{"function":a.languages.javascript.function,punctuation:/[={}[\];(),.:]/,keyword:a.languages.javascript.keyword},alias:"language-javascript"}},a.languages.jsx.tag)})(Prism);