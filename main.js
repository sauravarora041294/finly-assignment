$(function(){
		const api_url = 'http://localhost:3000/';
		$('.form-div').hide();
		getPostData();
		var post_data;
		var post_array=[];
		$(".test-all").click(function(){
			getPostData();
		})
		function getPostData(){
			$.ajax({
				url: api_url+'posts',
				type: 'GET',
				success: function(result){
					post_data = result;
					$('.form-div').hide();
					$('.content-div').empty();
					$.each(post_data, function(index, item) {
						var i = index+1;
						post_array.push(item); 
						$('.content-div').append('<li class="div-main div-main-'+item['id']+'">'+'<h3 class="post-head">'+item['title']+'</h3>'+
							'<span class="post-text">'+item['body']+'</span>'+'<button class="btn btn-danger del-btn del-btn-'+item['id']+'" id="'+item['id']+'">Delete Post</button>'+
							'<button id="'+item['id']+'" class="btn btn-info update-btn edit-btn-'+item['id']+'">Edit Post</button>'+
							'<button id="'+item['id']+'" class="btn btn-warning show-btn show-btn-'+item['id']+'">Show Post Details</button>'+'</li>');
						})
						$('.update-btn').unbind().click(function(){
							console.log($(this).attr('id')+' clicked...');
							editPosts($(this).attr('id'));
						})
						$('.del-btn').unbind().click(function(e){
							deletePost($(this).attr('id'));
						})
						$('.show-btn').unbind().click(function(){
							showPostDetails($(this).attr('id'));
						})
						$('.create-post').unbind().click(function(e){
							createPost();
						})
						$(".post-btn").unbind().click(function(){
							postSubmit();
						})
					},
					error: function(error){
						console.log('Error $(error)')
					}
			})
		}
						function createPost(){
							$('.content-div').empty();
							$('.form-div').show();
							$('input[name="userid"]').val('').prop("disabled", false);
							$('input[name="title"]').val('');
							$('#text_body').val('');
							$('.edit-btn').hide();
							$('.post-btn').show();
						}
						function postSubmit(e){
							var userid = $('input[name="userid"]').val();
							var title = $('input[name="title"]').val();
							var body = $('#text_body').val();
							$.ajax({
								url: api_url+'posts',
								data: {userId: userid, title: title, body: body },
								type: 'POST',
								success: function(result){
									console.log('post successful');
								},
								error: function(error){
									console.log(error);
								}
							})
							$('.user-id').val('');
							$('.title').val('');
							$('#text_body').val('');
							getPostData();
					}
						function editPosts(_id){
								$.get(api_url+'posts/'+_id, function(res){
								let id = res['userId'],
									title = res['title'],
									body = res['body'];
									$('.div-main').empty();
									$('.content-div').empty();
									$('.form-div').show();
									$('.post-btn').hide();
									$('.edit-btn').show();
									$('input[name="userid"]').val(id).prop("disabled", true);
									$('input[name="title"]').val(title);
									$('#text_body').val(body);
									$('.edit-btn').unbind().click(function(){
										let updated_userid = $('.user-id').val(),
										updated_title = $('.title').val(),
										updated_body = $('#text_body').val();
										$.ajax({
											url: api_url+'posts/'+_id,
											type: 'PUT',
											data: {userId: updated_userid, title: updated_title, body: updated_body },
											success: function(result){
												console.log(result);
												$('.form-div').hide();
												getPostData();
											}
										})	
									})
								})
							}
						function deletePost(id){
							$.ajax({
								url: api_url+'posts/'+id,
								type: 'DELETE',
								success: function(){
									console.log('deleted');
									getPostData();
								},
								error: function(error){
									console.log(error);
								}
							})
						}
						function showPostDetails(id){
							$.get(api_url+'posts/'+id, function(result){
								$('.content-div').empty();
								$('.content-div').append('<li class="div-main div-main-'+id+'">'+'<h3 class="post-head">'+result['title']+'</h3>'+
											'<span class="post-text">'+result['body']+'</span>'+'<h5 class="comments-heading">Comments:</h5>'+'</li>');
							})
							$.get(api_url+'posts/'+id+'/comments', function(res){
							if(res.length !== 0){
								$.each(res, function(commentId,comment){
									$('.div-main-'+id).append('<li class="div-comments">'+comment['body']+'</li>');
								})
							} else{
								$('.div-main-'+id).append('<li class="div-comments"> 0 comments</li>');
							}
						})
					}
	})