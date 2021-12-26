var $j = jQuery.noConflict(); // declare $j instead of $, for avoiding conflicts with other JQ libraries

$j(function($){
	$j('.content').first().slideDown();
	$j('ul li a').on("click", function(event){
		var current_tab = $j(this);
		$j('ul li a').removeClass('active');
		current_tab.addClass('active');

		$j('.content').slideUp();
		var current_tab_href = current_tab.attr("href");// #home
		$j(current_tab_href).slideDown();// $('#home')

		event.preventDefault();
	})

	var count = 0;

	// LocalStorage
	$j('.atc').on("click",function(){
		let id = $j(this).data('id');
		let name = $j(this).data('name');
		let image = $j(this).data('image');
		let price = $j(this).data('price');
		let item = {
			id: id, // key: value JavaScript Object
			name: name,
			image: image,
			price: price,
			qty: 1
		}	
		// console.log(item);

		let cart = localStorage.getItem('cart');
		let myArr = '';
		if(cart != null){
			myArr = JSON.parse(cart);
		}else{
			 myArr = []
		}

		//Cart Notification
		let cartnoti = $('.item-count').data('count');
		if (cartnoti != null) {
		    setTimeout(function(){
		      	count++;
		      	$(".cart-nav .item-count").text(count);
		      	$(".cart-nav .item-count").data('count', count);
		    }, 1000);
		}
		  	

		// Qty increasement
		let status = 0;
		for (row of myArr){
			if(row.id == id){
				row.qty++;
				status = 1;
			}
		}
		if(status == 0){
			myArr.push(item)
		}


		// JS Object => JSON String to save LocalStorage
		let myArrString = JSON.stringify(myArr);
		// console.log(myArrString);

		localStorage.setItem('cart',myArrString);
		getdata();

		Swal.fire({
		  position: 'top-end',
		  icon: 'success',
		  title: 'Your Item has been successfully moved to Cart!',
		  showConfirmButton: false,
		  timer: 1000
		})
	})

	// Get Data from LocalStorage
	function getdata(){
		let cart = localStorage.getItem('cart');
		if(cart != null){
			let myArr = JSON.parse(cart);
			let row = '';
			let total = 0;
			let i = 0;
			for([index,item] of myArr.entries()){
				total += (item.qty * item.price);
				row += `<tr>
						<td>
							${++i}
						</td>
						<td><img src="${item.image}" width="60px" height="auto"></td>
						<td>${item.name}</td>
						<td>${item.price}</td>
						<td>
							<input type="number" min="1" value="${item.qty}" data-id="${index}" class="updateqty">
						</td>
						<td>${item.qty * item.price} Ks 
							<button class="remove" data-id="${index}"><i class="fas fa-times"></i></button>
						</td>
						</tr>`
			}

			row += `<tr>
					<td colspan="5">Total Amount</td>
					<td>${total} Ks</td>
					</tr>`

			$j('tbody').html(row);
			$j('#checkout').show();
		}else{
			$j('tbody').html(`<tr><td colspan="6">Your Cart is empty!</td></tr>`)
			$j('#checkout').hide();
		}
	}

	getdata();

	// Remove
	$j('tbody').on("click",".remove",function(){
		let index = $j(this).data('id');
		// console.log(index);
		let cart = localStorage.getItem('cart');
		let myArr = JSON.parse(cart);
		// Delete one row
		myArr.splice(index, 1);
		// JS Object => JSON String
		let myArrString = JSON.stringify(myArr);
		// console.log(myArrString);
		localStorage.setItem('cart', myArrString);
		getdata();
	})

	// increase - decrease Qty
	$j('tbody').on("change",".updateqty",function(){
		let index = $j(this).data('id');
		// console.log(index)
		let qty = $j(this).val();
		let cart = localStorage.getItem('cart');
		let myArr = JSON.parse(cart);
		myArr[index].qty = qty
		// JS Object => JSON String to save LocalStorage
		let myArrString = JSON.stringify(myArr);
		// console.log(myArrString);
		localStorage.setItem('cart',myArrString);
		getdata();
	})

	// checkout
	$j('.checkout').on("click",function(){
		localStorage.removeItem('cart');

		Swal.fire({
		  position: 'top-end',
		  icon: 'success',
		  title: 'Complete Ordered <br> Good Job! &#128578;',
		  showConfirmButton: false,
		  timer: 1500
		})

		getdata();
	})
	
})