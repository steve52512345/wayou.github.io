Prism.languages.eiffel={string:[/"(?:%\s+%|%"|.)*?"/,/"([^[]*)\[[\s\S]+?\]\1"/,/"([^{]*)\{[\s\S]+?\}\1"/],comment:/--.*/,"char":/'(?:%'|.)+?'/,keyword:/\b(?:across|agent|alias|all|and|attached|as|assign|attribute|check|class|convert|create|Current|debug|deferred|detachable|do|else|elseif|end|ensure|expanded|export|external|feature|from|frozen|if|implies|inherit|inspect|invariant|like|local|loop|not|note|obsolete|old|once|or|Precursor|redefine|rename|require|rescue|Result|retry|select|separate|some|then|undefine|until|variant|Void|when|xor)\b/i,"boolean":/\b(?:True|False)\b/i,number:[/\b0[xcb][\da-f](?:_*[\da-f])*\b/i,/(?:\d(?:_*\d)*)?\.(?:(?:\d(?:_*\d)*)?[eE][+-]?)?\d(?:_*\d)*|\d(?:_*\d)*\.?/],punctuation:/:=|<<|>>|\(\||\|\)|->|\.(?=\w)|[{}[\];(),:?]/,operator:/\\\\|\|\.\.\||\.\.|\/[~\/]?|[><\/]=?|[-+*^=~]/};