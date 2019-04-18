document.addEventListener("DOMContentLoaded", function() {

	// Globals
	var $start = document.getElementById('start');
	var $wallet = document.getElementById('wallet');
	var $balance = document.getElementById('balance');
	var $refreshbalance = document.getElementById('refreshbalance');
	var $addtowallet = document.getElementById('addtowallet');
	var $winning = document.getElementById('winning');
	var $currentwin = document.getElementById('currentwin');
	var $toggledebug = document.getElementById('toggledebug');
	var $debugconsole = document.getElementById('debugconsole');
	var $debugon = document.getElementById('debugon');

	var margin2Elems = '22px 0 0';
	var margin3Elems = '-30px 0px 0px';
	var walletHeight = '40px';
	var debugConsoleHeight = '182px';
	var basicTextColor = '#000';
	var blinkingSumBackground = '#f00';
	var blinkingSumColor = '#fff';
	var blinkingSlotBoxShadow = '0px 0px 20px 20px #f00';
	var blinkingSlotRadius = '50%';

	checkBalance(); // initial checking balance
	initialRandom(5); // num - number of slots (integer)

	$start.onclick = function() { 
		$wallet.value = +$wallet.value - 1;
		checkBalance();
		if ($debugon.checked) {
			debugGame();
		} else {
			game();			
		}
	};

	$refreshbalance.onclick = function() { refreshBalance(this) };

	$addtowallet.onclick = function() {
		let winning = $winning.innerHTML;

		$wallet.value = +$wallet.value + +winning;
		checkBalance();
		$winning.innerHTML = 0;
	};

	$toggledebug.onclick = function() {
		if ($debugconsole.style.height != debugConsoleHeight) {
			$debugconsole.style.height = debugConsoleHeight;
		} else {
			$debugconsole.style.height = '0px';
		}		
	};

	$debugon.onchange = function() {
		let $reel = document.querySelectorAll('.slotmachine_debugReel');
		let selectNum = $reel.length;
		let checked = this.checked;

		for (let i = 0; i < selectNum; i++) {
			if (checked) {
				$reel[i].disabled = false;
			} else {
				$reel[i].disabled = true;				
			}
		}
	};

	// Functions
	function checkBalance() {
		if (+$wallet.value < 1) { 
			$wallet.value = 1 
		}
		if (+$wallet.value > 5000) { 
			$wallet.value = 5000 
		}
		if (+$wallet.value == 1) {
			$start.disabled = true;
		} else {
			$start.disabled = false;
		}
		$balance.innerHTML = $wallet.value;
	}

	function refreshBalance(element) {
		if (element.getAttribute('data-status') == 'active') {
			$start.disabled = false;
			checkBalance();
			element.innerHTML = 'Add coins';
			element.setAttribute('data-status', 'inactive');
			$wallet.style.height = '0px';	
		} else {
			$start.disabled = true;
			element.innerHTML = 'Add';
			element.setAttribute('data-status', 'active');
			$wallet.style.height = walletHeight;
		}
	}

	function initialRandom(num) {		
		let reelsNum = document.querySelectorAll('.reel').length;

		for (let reel = 0; reel < reelsNum; reel++) {
			let iterationsNum = Math.floor(Math.random() * num);

			for (let i = 0; i < iterationsNum; i++) {
				let $slot = document.querySelectorAll('.reel_slot');
				let $reel = document.querySelectorAll('.reel')[reel];
				let item = $slot[(num * (reel + 1)) - 1]; // order number of last element of reel
				let clone = item.cloneNode(true);
					
				$reel.insertBefore(clone, $reel.childNodes[0]);					
				item.remove();
			}
		}		
	}

	// Setting reel position (3 or 2 items per screen)
	function reelPosition(reel, pos) {
		let $reel = document.getElementById(reel);
		let reelPosition = pos || Math.floor(Math.random() * 2); // pos - for Debug

		if ((+reelPosition == 0) || (+reelPosition == 2)) {
			$reel.style.margin = margin2Elems;
			$reel.setAttribute('data-pos', '2');
		} else {
			$reel.style.margin = margin3Elems;
			$reel.setAttribute('data-pos', '3');
		}
	}

	function getResult() {
		let $reel1 = document.querySelector('#reel1');
		let $reel2 = document.querySelector('#reel2');
		let $reel3 = document.querySelector('#reel3');

		let reel1pos = $reel1.getAttribute('data-pos');
		let reel2pos = $reel2.getAttribute('data-pos');
		let reel3pos = $reel3.getAttribute('data-pos');

		let $reel1slot2 = $reel1.querySelector('.reel_slot:nth-child(2)');
		let $reel1slot3 = $reel1.querySelector('.reel_slot:nth-child(3)');
		let $reel2slot2 = $reel2.querySelector('.reel_slot:nth-child(2)');
		let $reel2slot3 = $reel2.querySelector('.reel_slot:nth-child(3)');
		let $reel3slot2 = $reel3.querySelector('.reel_slot:nth-child(2)');
		let $reel3slot3 = $reel3.querySelector('.reel_slot:nth-child(3)');

		if ((reel1pos == '2') && (reel2pos == '2') && (reel3pos == '2')) {
			let slot1attr = [$reel1slot2.getAttribute('data-itemid'), $reel1slot3.getAttribute('data-itemid')];
			let slot2attr = [$reel2slot2.getAttribute('data-itemid'), $reel2slot3.getAttribute('data-itemid')];
			let slot3attr = [$reel3slot2.getAttribute('data-itemid'), $reel3slot3.getAttribute('data-itemid')];

			if (winningCombinations.cherryCombo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.SevenX3Combo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.cherrySevenAnyCombo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.barX3Combo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.barX2Combo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.barCombo(slot1attr, slot2attr, slot3attr, 2)) { return true };
			if (winningCombinations.barAnyCombo(slot1attr, slot2attr, slot3attr, 2)) { return true };
		}

		if ((reel1pos == '3') && (reel2pos == '3') && (reel3pos == '3')) {
			let slot1attr = $reel1slot3.getAttribute('data-itemid');
			let slot2attr = $reel2slot3.getAttribute('data-itemid');
			let slot3attr = $reel3slot3.getAttribute('data-itemid');	

			if (winningCombinations.cherryCombo(slot1attr, slot2attr, slot3attr, 3)) { return true };
			if (winningCombinations.SevenX3Combo(slot1attr, slot2attr, slot3attr, 3)) { return true };
			if (winningCombinations.cherrySevenAnyCombo(slot1attr, slot2attr, slot3attr, 3)) { return true };	
			if (winningCombinations.barX3Combo(slot1attr, slot2attr, slot3attr, 3)) { return true };		
			if (winningCombinations.barX2Combo(slot1attr, slot2attr, slot3attr, 3)) { return true };
			if (winningCombinations.barCombo(slot1attr, slot2attr, slot3attr, 3)) { return true };
			if (winningCombinations.barAnyCombo(slot1attr, slot2attr, slot3attr, 3)) { return true; };
		}
		
		if ($debugon.checked) { console.log('--- no win ---'); }
	}

	function game() {
		$start.disabled = true;

		var timerId1 = setInterval(function() {	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel1');

			spin($slot,	$reel, 4);
		}, 100);
	
		var timerId2 = setInterval(function() { 	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel2');

			spin($slot,	$reel, 9);
		}, 60);
	
		var timerId3 = setInterval(function() { 	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel3');

			spin($slot,	$reel, 14);
		}, 80);

		setTimeout(function() {
		  reelPosition('reel1');
		  clearInterval(timerId1);
		}, 2000);

		setTimeout(function() {
		  reelPosition('reel2');
		  clearInterval(timerId2);
		}, 2500);

		setTimeout(function() {
		  reelPosition('reel3');
		  clearInterval(timerId3);
		  setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
		  $start.disabled = false;
		  checkBalance();	//blocks SPIN button if number of coins == 1
		}, 3000);
	}

	function debugGame() {
		let $debugReel1 = document.getElementById('debug-reel1');
		let $debugReel1Pos = document.getElementById('debug-reel1-pos');
		let $debugReel2 = document.getElementById('debug-reel2');
		let $debugReel2Pos = document.getElementById('debug-reel2-pos');
		let $debugReel3 = document.getElementById('debug-reel3');
		let $debugReel3Pos = document.getElementById('debug-reel3-pos');

		let debugReel1 = $debugReel1.value;
		let debugReel1Pos = $debugReel1Pos.value;
		let debugReel2 = $debugReel2.value;
		let debugReel2Pos = $debugReel2Pos.value;
		let debugReel3 = $debugReel3.value;
		let debugReel3Pos = $debugReel3Pos.value;

		let reel1Stopped = false;
		let reel2Stopped = false;
		let reel3Stopped = false;

		$start.disabled = true;			

		var timerId1 = setInterval(function() {	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel1');
			let $slotDebug;
			let slotDebug;

			// 0 = top, 1 = center, 2 = bottom
			if (debugReel1Pos == '0') {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(1)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel1 == slotDebug) {
					reelPosition('reel1', debugReel1Pos); //setting the position that we chose
					reel1Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId1);
				}
			} else {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(2)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel1 == slotDebug) {
					reelPosition('reel1', debugReel1Pos); //setting the position that we chose
					reel1Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId1);
				}
			}

			spin($slot,	$reel, 4);
		}, 100);
	
		var timerId2 = setInterval(function() { 	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel2');
			let $slotDebug;
			let slotDebug;

			if (debugReel2Pos == '0') {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(1)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel2 == slotDebug) {
					reelPosition('reel2', debugReel2Pos); //setting the position that we chose
					reel2Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId2);
				}
			} else {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(2)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel2 == slotDebug) {
					reelPosition('reel2', debugReel2Pos); //setting the position that we chose
					reel2Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId2);
				}
			}

			spin($slot,	$reel, 9);
		}, 60);
	
		var timerId3 = setInterval(function() { 	
			let $slot = document.querySelectorAll('.reel_slot');
			let $reel = document.getElementById('reel3');
			let $slotDebug;
			let slotDebug;

			if (debugReel3Pos == '0') {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(1)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel3 == slotDebug) {
					reelPosition('reel3', debugReel3Pos); //setting the position that we chose
					reel3Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId3);
				}
			} else {
				$slotDebug = $reel.querySelector('.reel_slot:nth-child(2)');
				let slotDebug = $slotDebug.getAttribute('data-itemid');
				if (debugReel3 == slotDebug) {
					reelPosition('reel3', debugReel3Pos); //setting the position that we chose
					reel3Stopped = true;
					if (reel1Stopped && reel2Stopped && reel3Stopped) {
						setTimeout(function() { getResult(); }, 100);  //we need a delay to complete animations before counting results
						$start.disabled = false;
		    			checkBalance();	//blocks SPIN button if number of coins == 1
					}
					clearInterval(timerId3);
				}
			}

			spin($slot,	$reel, 14);
		}, 80);

		
		// Just in case. If everything is correct this code will be ignored
		setTimeout(function() {
		  if (!(reel1Stopped && reel2Stopped && reel3Stopped)) {
		    reelPosition('reel1', debugReel1Pos);
		    clearInterval(timerId1);		  	
		  }
		}, 2000);

		setTimeout(function() {
		  if (!(reel1Stopped && reel2Stopped && reel3Stopped)) {
		    reelPosition('reel2', debugReel2Pos);
		    clearInterval(timerId2);		  	
		  }
		}, 2500);

		setTimeout(function() {
		  if (!(reel1Stopped && reel2Stopped && reel3Stopped)) {
		    reelPosition('reel3', debugReel3Pos);
		    clearInterval(timerId3);
		    setTimeout(function() { getResult(); }, 100);
		    $start.disabled = false;
		    checkBalance();	  	
		  }
		}, 3000);
	}

	function spin(slot, reel, lastItemPos) {
		let item = slot[lastItemPos];
		let clone = item.cloneNode(true);

		reel.insertBefore(clone, reel.childNodes[0]);
		item.remove();
	}

	// Winning slots will blink
	function currentWin(sum, slot1, slot2, slot3) {
		let $slot1, $slot2, $slot3; // for cherrySevenAnyCombo method

		if (slot1) {
			$slot1 = document.getElementById('reel1').querySelector('.reel_slot[data-itemid="'+slot1+'"]');
		}
		if (slot2) {
			$slot2 = document.getElementById('reel2').querySelector('.reel_slot[data-itemid="'+slot2+'"]');
		}
		if (slot3) {
			$slot3 = document.getElementById('reel3').querySelector('.reel_slot[data-itemid="'+slot3+'"]');
		}

		let blinkIndicator = 0;
		let blink = setInterval(function() {
			if (blinkIndicator != 1) {
				$currentwin.style.background = blinkingSumBackground;
				$currentwin.style.color = blinkingSumColor;
				if (slot1) { $slot1.style.boxShadow = blinkingSlotBoxShadow; }
				if (slot2) { $slot2.style.boxShadow = blinkingSlotBoxShadow; }
				if (slot3) { $slot3.style.boxShadow = blinkingSlotBoxShadow; }
				if (slot1) { $slot1.style.borderRadius = blinkingSlotRadius; }
				if (slot2) { $slot2.style.borderRadius = blinkingSlotRadius; }
				if (slot3) { $slot3.style.borderRadius = blinkingSlotRadius; }
				blinkIndicator = 1;
			} else {
				$currentwin.style.background = 'none';
				$currentwin.style.color = basicTextColor;
				if (slot1) { $slot1.style.boxShadow = 'none'; }
				if (slot2) { $slot2.style.boxShadow = 'none'; }
				if (slot3) { $slot3.style.boxShadow = 'none'; }
				if (slot1) { $slot1.style.borderRadius = '0'; }
				if (slot2) { $slot2.style.borderRadius = '0'; }
				if (slot3) { $slot3.style.borderRadius = '0'; }	
				blinkIndicator = 0;			
			}
		}, 100);

		$start.disabled = true;
		$currentwin.innerHTML = +$currentwin.innerHTML + sum;

		if ($debugon.checked) { console.log('--- win ---'); }

		setTimeout(function() { 
			clearInterval(blink);
			$currentwin.style.background = 'none';
			$currentwin.style.color = basicTextColor;
			if (slot1) { $slot1.style.boxShadow = 'none'; }
			if (slot2) { $slot2.style.boxShadow = 'none'; }
			if (slot3) { $slot3.style.boxShadow = 'none'; }
			if (slot1) { $slot1.style.borderRadius = '0'; }
			if (slot2) { $slot2.style.borderRadius = '0'; }
			if (slot3) { $slot3.style.borderRadius = '0'; }
			$start.disabled = false;
			$winning.innerHTML = +$winning.innerHTML + +$currentwin.innerHTML;
			checkBalance();
			$currentwin.innerHTML = 0; //blocks SPIN button if number of coins == 1
		}, 1000);
	}

	// Object with winning combinations methods
	var winningCombinations = {
		barAnyCombo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['3', '4', '5'];

			if ($debugon.checked) { console.log('barAnyCombo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(5, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(5, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(5, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
		barCombo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['3'];

			if ($debugon.checked) { console.log('barCombo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(10, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(10, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(10, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
		barX2Combo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['4'];

			if ($debugon.checked) { console.log('barX2Combo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(20, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(20, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(20, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
		barX3Combo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['5'];

			if ($debugon.checked) { console.log('barX3Combo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(50, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(50, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(50, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
		cherrySevenAnyCombo : function(attr1, attr2, attr3, reelpos) {
			let combo1 = ['1'];
			let combo2 = ['2'];

			if ($debugon.checked) { console.log('cherrySevenAnyCombo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo1.indexOf(attr1) != -1) || (combo1.indexOf(attr2) != -1) || (combo1.indexOf(attr3) != -1)) {
					if ((combo2.indexOf(attr1) != -1) || (combo2.indexOf(attr2) != -1) || (combo2.indexOf(attr3) != -1)) {						
						if ((combo1.indexOf(attr1) == -1) && (combo2.indexOf(attr1) == -1)) { currentWin(75, 0, attr2, attr3); }							
						else if ((combo1.indexOf(attr2) == -1) && (combo2.indexOf(attr2) == -1)) { currentWin(75, attr1, 0, attr3); }
						else if ((combo1.indexOf(attr3) == -1) && (combo2.indexOf(attr3) == -1)) { currentWin(75, attr1, attr2, 0); }
						else { currentWin(75, attr1, attr2, attr3); }
						return true;
					}
				}				
			} else if (reelpos == 2) {
				if ((combo1.indexOf(attr1[0]) != -1) || (combo1.indexOf(attr2[0]) != -1) || (combo1.indexOf(attr3[0]) != -1)) {
					if ((combo2.indexOf(attr1[0]) != -1) || (combo2.indexOf(attr2[0]) != -1) || (combo2.indexOf(attr3[0]) != -1)) {						
						if ((combo1.indexOf(attr1[0]) == -1) && (combo2.indexOf(attr1[0]) == -1)) { currentWin(75, 0, attr2[0], attr3[0]); }							
						else if ((combo1.indexOf(attr2[0]) == -1) && (combo2.indexOf(attr2[0]) == -1)) { currentWin(75, attr1[0], 0, attr3[0]); }
						else if ((combo1.indexOf(attr3[0]) == -1) && (combo2.indexOf(attr3[0]) == -1)) { currentWin(75, attr1[0], attr2[0], 0); }
						else { currentWin(75, attr1[0], attr2[0], attr3[0]); }
						return true;
					}
				}
				if ((combo1.indexOf(attr1[1]) != -1) || (combo1.indexOf(attr2[1]) != -1) || (combo1.indexOf(attr3[1]) != -1)) {
					if ((combo2.indexOf(attr1[1]) != -1) || (combo2.indexOf(attr2[1]) != -1) || (combo2.indexOf(attr3[1]) != -1)) {						
						if ((combo1.indexOf(attr1[1]) == -1) && (combo2.indexOf(attr1[1]) == -1)) { currentWin(75, 0, attr2[1], attr3[1]); }							
						else if ((combo1.indexOf(attr2[1]) == -1) && (combo2.indexOf(attr2[1]) == -1)) { currentWin(75, attr1[1], 0, attr3[1]); }
						else if ((combo1.indexOf(attr3[1]) == -1) && (combo2.indexOf(attr3[1]) == -1)) { currentWin(75, attr1[1], attr2[1], 0); }
						else { currentWin(75, attr1[1], attr2[1], attr3[1]); }
						return true;
					}
				}					
			}

			return false;
		},
		SevenX3Combo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['2'];

			if ($debugon.checked) { console.log('SevenX3Combo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(150, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(150, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(150, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
		cherryCombo : function(attr1, attr2, attr3, reelpos) {
			let combo = ['1'];

			if ($debugon.checked) { console.log('cherryCombo: '+'['+attr1+']-['+attr2+']-['+attr3+']'); }

			if (reelpos == 3) {
				if ((combo.indexOf(attr1) != -1) && (combo.indexOf(attr2) != -1) && (combo.indexOf(attr3) != -1)) {
					currentWin(1000, attr1, attr2, attr3);
					return true;
				}				
			} else if (reelpos == 2) {
				if ((combo.indexOf(attr1[0]) != -1) && (combo.indexOf(attr2[0]) != -1) && (combo.indexOf(attr3[0]) != -1)) {
					currentWin(2000, attr1[0], attr2[0], attr3[0]);
					return true;
				}
				if ((combo.indexOf(attr1[1]) != -1) && (combo.indexOf(attr2[1]) != -1) && (combo.indexOf(attr3[1]) != -1)) {
					currentWin(4000, attr1[1], attr2[1], attr3[1]);
					return true;
				}					
			}

			return false;
		},
	}

});