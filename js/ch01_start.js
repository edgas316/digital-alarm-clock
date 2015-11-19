function onReady (){
	console.log("Hello I'm ready")
	var clock = new com.eG.AlarmClock('clock')
	var clock2 = new com.eG.TextClock('clock2',- 420,'ETC')
	var clock3 = new com.eG.Clock('clock3',420,'XXX')

	// LiveDate.call(clock, 1,2,3)
	LiveDate.apply(clock,[1,2,3])
}
function LiveDate(a,b,c){
	console.log(this, a,b,c)
}
Date.__interval = 0
Date.__aDates = []
Date.addToInterval = function(date){
	this.__aDates.push(date)
	if(!Date.__interval)
		Date.__interval = setInterval(function(){Date.updateDates()},1000)
}
Date.updateDates = function(){
	for(var i=0; i<this.__aDates.length; i++){
		if(this.__aDates[i] instanceof Date)
		this.__aDates[i].updateSeconds()
	else if(this.__aDates[i] instanceof Function)
		this.__aDates[i]()
	else if(this.__aDates[i] && this.__aDates[i]['update'])
		this.__aDates[i].update()
	}
}
Date.prototype.updateSeconds = function(){
	this.setSeconds(this.getSeconds()+1)
}

Date.prototype.autoClock = function(isAuto){
	if(isAuto){
		Date.addToInterval(this)
	}
}
var com = com || {}
	com.eG = com.eG || {}

com.eG.Clock = function(id,offset,label){
	offset = offset || 0
	label = label || ''
	var d = new Date()
	var offset = (offset+d.getTimezoneOffset())*60*1000
	this.d = new Date(offset+d.getTime())
	this.d.autoClock(true)
	this.id = id
	this.label = label

	this.tick(true)
	var ClockObj = this
	Date.addToInterval(function(){ 
			ClockObj.updateClock()})
}
com.eG.Clock.prototype.tick = function(isTick){
	// clearInterval(this.myInternalInterval)
	this.isTicking = isTick
	// if(isTick){
	// 	var ClockObj = this;
	// 	this.myInternalInterval = setInterval(function(){ 
	// 		ClockObj.updateClock()},1000)
	// 		this.updateClock()
	// }
}
com.eG.Clock.prototype.version = 'version 1.00'
com.eG.Clock.prototype.updateClock = function(){
		if(this.isTicking){
		var date = this.d
			clock = document.getElementById(this.id)
			clock.innerHTML = this.formatOutput(date.getHours(), date.getMinutes(),date.getSeconds(),this.label)
		}
	}
com.eG.Clock.prototype.formatOutput = function(h,m,s,l){
	return this.formatDigits(h)+':'
		+this.formatDigits(m)+':'
		+this.formatDigits(s) + " " 
		+l
}
com.eG.Clock.prototype.formatDigits = function(val){
		if(val<10)val = "0" + val
		return val
}
com.eG.TextClock = function(id,offset,lebel){
	com.eG.Clock.apply(this, arguments)
	console.log(this.version)
}
com.eG.TextClock.prototype = createObject(com.eG.Clock.prototype, com.eG.TextClock)
com.eG.Clock.prototype.version = 'version 1.01'
com.eG.TextClock.prototype.formatOutput = function(h,m,s,l){
	return this.formatDigits(h)+' Hour '
		+this.formatDigits(m)+' Minuts '
		+this.formatDigits(s) + " Seconds " 
		+l
}
com.eG.AlarmClock = function(id,offset,lebel){
	com.eG.Clock.apply(this, arguments)
	console.log(this.version)

	this.doUpdate = true
	this.dom = document.getElementById(id)
	this.dom.contentEditable = true
	var that = this
	this.dom.addEventListener('focus',function(e){
		this.innerHTML = this.innerHTML.slice(0,this.innerHTML.lastIndexOf(':'))
		that.tick(false)
	})
	this.dom.addEventListener('blur',function(e){
		var a = this.innerHTML.split(':')
		that.aH = parseInt(a[0])
		that.aM = parseInt(a[1])
		if((that.aH>=0 && that.aH<24) && 
			(that.aH>=0 && that.aM<60)){
			var event = new Event('restart_tick')
			this.dispatchEvent(event)
		}
		console.log(that.aH, that.aM)
	})
	this.dom.addEventListener('restart_tick',function(){
	that.tick(true)
})
}
com.eG.AlarmClock.prototype = createObject(com.eG.Clock.prototype, com.eG.AlarmClock)
com.eG.AlarmClock.prototype.formatOutput = function(h,m,s,l){
	var output
	if(h==this.aH && m==this.aM){
		output = "ALARM WAKE UP"
		var snd = new Audio('art/beep.mp3')
			snd.play()
	}else output = com.eG.Clock.prototype.formatOutput.apply(this,arguments)
		return output
}
function createObject(proto,cons){
	function c(){}
	c.prototype = proto
	c.prototype.constructor = cons
	return new c()
}
window.onload = onReady