Polymer({is:"test-element",properties:{stringProp:String,numProp:Number,objectProp:Object,elementProp:Object,objectNotify:{type:Object,notify:true},objectNotifyUnary:{type:Object,notify:!0},boolProp:Boolean},bind:{numProp:"numChanged",elementProp:"elemChanged"},numChanged:function(){},elemChanged:function(){}});Polymer({is:"x-firebase",properties:{location:String,limit:Number,start:Number,end:Number,data:{type:Object,notify:true},keys:{type:Array,notify:true},childEvents:Boolean,priority:Number,dataReady:{type:Boolean,notify:true},log:Boolean},bind:{location:"locationChanged",data:"dataChanged",ref:"debouncedRequery",limit:"debouncedRequery",start:"debouncedRequery",end:"debouncedRequery"},features:function(){this._data.data=null;this.defaultFeatures()},locationChanged:function(){this.closeQuery();if(this.location){this.ref=new Firebase(this.location);this.debouncedRequery()}else{this.ref=null}},debouncedRequery:function(){if(!this.requeryJob){this.requeryJob=setTimeout(function(){this.requeryJob=null;this.requery()}.bind(this),0)}},requery:function(){this.closeQuery();this.closeObserver();var t=this.ref;if(t){if(this.start){t=t.startAt(this.start)}if(this.end){t=t.endAt(this.end)}if(this.limit>0){t=t.limit(this.limit)}this.query=t;this.queryChanged()}},queryChanged:function(){this._updateData(null);this.dataReady=false;this.valueLoading=true;this.query.once("value",this.valueLoaded,this.errorHandler,this)},valueLoaded:function(t){this.valueLoading=false;if(this.ref.key()!==t.key()){this.log&&console.warn("squelching stale response [%s]",t.key());return}this.log&&console.log("acquired value "+this.location);this.dataReady=true;this._remoteValueChanged=true;this._updateData(t.val());if(this.data){this.dataChange()}this.observeQuery()},valueUpdated:function(t){this._updateData(t.val());if(this.data){this.dataChange()}},_updateData:function(t){this.closeObserver();this._lastData=t;this.data=t;this.observeData()},observeQuery:function(){if(this.data instanceof Object||this.data instanceof Array){this.query.on("child_added",this.childAdded,this.errorHandler,this);this.query.on("child_changed",this.childChanged,this.errorHandler,this);this.query.on("child_removed",this.childRemoved,this.errorHandler,this)}else{this.query.on("value",this.valueUpdated,this.errorHandler,this)}},closeQuery:function(){if(this.query){this.query.off()}},observeData:function(){},closeObserver:function(){},dataChanged:function(){if(!this._remoteValueChanged){this._updateData(this.data);this.commit()}this._remoteValueChanged=false},priorityChanged:function(){if(this.ref&&this.priority!=null){this.ref.setPriority(this.priority,this.errorHandler)}},discardObservations:function(){if(this.observer){this.observer.discardChanges()}},deliverObservations:function(){if(this.observer){this.observer.deliver()}},childAdded:function(t){if(this.data){this.modulateData("updateData",t)}else if(!this.valueLoading){this.valueLoading=true;this.query.once("value",this.valueLoaded,this)}this.childEvent("child-added",t)},childChanged:function(t){if(!this.valueLoading){this.modulateData("updateData",t)}this.childEvent("child-changed",t)},childRemoved:function(t){if(!this.valueLoading){this.modulateData("removeData",t)}this.childEvent("child-removed",t)},childEvent:function(t,e){this.log&&console.log(t,e.key());if(this.childEvents){this.fire(t,{name:e.key(),value:e.val()})}},modulateData:function(t,e){this.deliverObservations();this[t](e);this.dataChange();this.discardObservations()},updateData:function(t){if(!this.data){this.data={}}this.data[t.key()]=t.val()},removeData:function(t){var e=t.key();if(this.data instanceof Array){this.data.splice(e,1);if(data.length==0){this._updateData(null)}}else if(this.data){delete this.data[e];if(Object.keys(this.data).length===0){this._updateData(null)}}},dataChange:function(){if(this.data){this.keys=this.data instanceof Object?Object.keys(this.data):[]}if(this.notifyPropertyChange){this.notifyPropertyChange("data")}},observeArray:function(t){this.commit()},observeObject:function(t,e,i,a){var r=this;Object.keys(t).forEach(function(t){r.commitProperty(t)});Object.keys(e).forEach(function(t){r.remove(t)});Object.keys(i).forEach(function(t){r.commitProperty(t)})},commitProperty:function(t){this.log&&console.log("commitProperty "+t);if(this.ref){this.ref.child(t).set(this.data[t],this.errorHandler)}},remove:function(t){this.ref.child(t).remove(this.errorHandler)},commit:function(){this.log&&console.log("commit");if(this.ref){if(this.priority!=null){this.ref.setWithPriority(this.data||{},this.priority,this.errorHandler)}else{this.ref.set(this.data||{},this.errorHandler)}}},push:function(t){var e;if(this.data instanceof Array){this.commitProperty(this.data.push(t)-1)}else{e=this.ref.push(t,this.errorHandler)}this.dataChange();return e},errorHandler:function(t){if(t){this.fire("error",{error:t})}}});