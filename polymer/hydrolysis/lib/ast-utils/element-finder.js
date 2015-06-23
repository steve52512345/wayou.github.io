"use strict";var estraverse=require("estraverse");var esutil=require("./esutil");var findAlias=require("./find-alias");var analyzeProperties=require("./analyze-properties");var astValue=require("./ast-value");var elementFinder=function e(){var e=[];var r;var t={is:function(e){if(e.type=="Literal"){r.is=e.value}},properties:function(e){var t=analyzeProperties(e);for(var i=0;i<t.length;i++){r.properties.push(t[i])}},behaviors:function(e){if(e.type!="ArrayExpression"){return}r.behaviors=[];for(var t=0;t<e.elements.length;t++){var i=astValue.expressionToValue(e.elements[t]);if(i===undefined)i=astValue.CANT_CONVERT;r.behaviors.push(i)}}};var i={enterCallExpression:function n(e,t){var i=e.callee;if(i.type=="Identifier"){if(i.name=="Polymer"){r={type:"element",desc:esutil.getAttachedComment(t),events:esutil.getEventComments(t).map(function(e){return{desc:e}})}}}},leaveCallExpression:function s(t,i){var n=t.callee;if(n.type=="Identifier"){if(n.name=="Polymer"){if(r){e.push(r);r=undefined}}}},enterObjectExpression:function a(e,i){if(r&&!r.properties){r.properties=[];for(var n=0;n<e.properties.length;n++){var s=e.properties[n];var a=esutil.objectKeyToString(s.key);if(!a){throw{message:"Cant determine name for property key.",location:e.loc.start}}if(a in t){t[a](s.value);continue}r.properties.push(esutil.toPropertyDescriptor(s))}return estraverse.VisitorOption.Skip}}};return{visitors:i,elements:e}};module.exports=elementFinder;