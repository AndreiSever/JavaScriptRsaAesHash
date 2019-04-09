$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	/* Step 1 */
	function stepgroup(i,j){
		if (j==11){
			$('#step'+i+' #step'+i+'12').css('display','none');
			$('#step'+i+' #step'+i+'13').css('display','none');
		}
		if (j==12){
			$('#step'+i+' #step'+i+'11').css('display','none');
			$('#step'+i+' #step'+i+'13').css('display','none');
		}
		if (j==13){

			$('#step'+i+' #step'+i+'12').css('display','none');
			$('#step'+i+' #step'+i+'11').css('display','none');
		}
	}
	// AES 
	$('#step11 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		stepgroup(2,11);
		// Go to step 2
		step(2);
	});

	$('#step11 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		stepgroup(2,11);
		step(2);
	});
	//HASH
	$('#step12 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		stepgroup(2,12);
		// Go to step 2
		step(2);
	});
	//RSA
	$('#step13 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		stepgroup(3,13);
		// Go to step 3
		step(3);
	});

	/* Step 2 */

	//Выбор файла
	$('#step211 .button').click(function(){
		$(this).parent().find('input').click();
	});
	$('#step212 .button').click(function(){
		$(this).parent().find('input').click();
	});

	var file = null;

	$('#step211').on('change', '#encrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Пожалуйста выберите файл!');
			return false;
		}

		file = e.target.files[0];

		if(file.size > 1024*1024){
			alert('Пожалуйста выыберите файд меньше 1 мб.');
			return;
		}
		stepgroup(3,11);
		step(3);
	});

	$('#step211').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Please select a file to decrypt!');
			return false;
		}

		file = e.target.files[0];
		stepgroup(3,11);
		step(3);
	});
	$('#step212').on('change', '#encrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Пожалуйста выберите файл!');
			return false;
		}

		file = e.target.files[0];

		if(file.size > 1024*1024){
			alert('Пожалуйста выыберите файд меньше 1 мб.');
			return;
		}
		stepgroup(3,12);
		step(3);
	});


	/* Step 3 */

	//AES
	$('#step311 a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();

		input.val('');

		if(password.length<5){
			alert('Выберите пожалуйста слово длиннее 5!');
			return;
		}
		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			reader.onload = function(e){
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');

				step(4);
			};

			reader.readAsDataURL(file);
		}
		else {
		
			reader.onload = function(e){

				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);

				if(!/^data:/.test(decrypted)){
					alert("Введено неправильное слово.");
					return false;
				}

				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encrypted',''));

				step(4);
			};

			reader.readAsText(file);
		}
	});
	
	//RSA
	$('#step313 a.button.process').click(function(){
	
			var pub = '-----BEGIN PUBLIC KEY-----\
		MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnGK+Rs0i0fcXViFzPxf3\
		TMBI0AFEUKJfKD6aaA9YQmxyAf+0oHsGrIPJjQ2Vok4Odnv/KLUx3VJVxW20EWIk\
		4JgKRk73FWyp1hRPDaPoQZqpduFnJE1DiZT5IIGYL/qiLWZAgx/CQyd7mdSyaw30\
		NGV1bZU83/Evf30GyW9mumVwC/ncKrlyJ0Gbv4yKRouMbHsgbpOiAa2UBMPVNgzb\
		mZPIC8BUVGrGdD8NnYV6WZA9wLODlJEEDX8kratCGIr3vuCw9xYtKWkooaOFm9d9\
		R/glCzUOXuiWdZH3xY6RPDE18a7pZwbSvng10w140j3+dkXpvnNd+ApvdN057uon\
		Nh6vuN0JuHNaUR79y31PN0cc9KG0z7B9Ywcbmda1WQPavACbVFq3isLiUWAdoe/c\
		7f+J9H9LEWZNhNQHk31YpTAJf2G0EQ21sRG/vIxsZHj3sXQxodNOuVN0bcMGUgXo\
		eaIuTzUjz1hmN10ZbMKLgvgSmELzj+QQ5maHuElJm4XqmFcBER5NOHECFEMi7xtA\
		53nb/S8a+0M2utesJi/p5tljmVMVJFnGGxHZRuqF8iqamPQe0izTf2YXr+w0YhHp\
		KGQkz/Ct58NcOSxydQ7AykAcUZ0XQZbYzF71n7Nl+abCAkVQGtfHv1MsnT7y8VoH\
		ljRGkRQLe0WCQ2bP6wjfYO8CAwEAAQ==\
		-----END PUBLIC KEY-----';
		var crypt = new JSEncrypt();
		crypt.setPublicKey(pub);

		var encrypted = crypt.encrypt($("#data").val());
		$("#encryptedd").val(encrypted);
		
		var privkey='-----BEGIN RSA PRIVATE KEY-----\
			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\
			-----END RSA PRIVATE KEY-----';
		crypt.setPrivateKey(privkey);
		var decrypted = crypt.decrypt(encrypted);
		$("#reply").val(decrypted )
	
	});
	
	//HASH
	$('#step312 a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();

		input.val('');

		if(password.length<5){
			alert('Выберите пожалуйста слово длиннее 5!');
			return;
		}

		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			reader.onload = function(e){

				var encrypted = CryptoJS.HmacSHA256(e.target.result, password);

				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');

				step(4);
			};

			reader.readAsDataURL(file);
		}
	});

	/* The back button */


	back.click(function(){

		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});
		$('#step211').css('display','block');
		$('#step212').css('display','block');
		$('#step213').css('display','block');
		$('#step311').css('display','block');
		$('#step312').css('display','block');
		$('#step313').css('display','block');
		step(1);
	});


	// Функция передвигает блоки с шагами

	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}
		stage.css('top',(-(i-1)*100)+'%');
	}

});