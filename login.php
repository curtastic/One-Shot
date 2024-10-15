<?php

$error = @$_GET['error'];
if($error) {
	$html = $error;
} else {
	$html = "
		Logging in...
		<script>
			var hash = window.location.hash
			if(!hash) {
				alert('No token')
			} else {
				//alert(hash)
				if(hash.indexOf('#token=') !== 0) {
					alert('No token 2')
				} else {
					hash = hash.substr(7)
					if(!hash) {
						alert('No token 3')
					} else {
						window.location = 'https://curtastic.com/lazersniper/#'+hash
					}
				}
			}
		</script>
	";
}


echo "
<html>
	<title>Lazer Sniper Login</title>
	<body>
		$html
	</body>
</html>
";
