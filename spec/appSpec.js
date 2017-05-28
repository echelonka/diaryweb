describe("app", function(){
	user = new User("jack", "123");
	it('should be a user', function(){
		expect(user.nickName).toBe("jack");
	});
});