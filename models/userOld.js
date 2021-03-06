var mongodb = require('./DB');

function User(user) {
	this.username = user.username;
	this.password = user.password;
}

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
	//要存入数据库的用户文档
	var user = {
		username: this.username,
		password: this.password
	};
	//打开数据库
	mongodb.open(function(err, mongodb) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 users 集合
		mongodb.collection('user', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//将用户数据插入 users 集合
			collection.insert(user, {
				safe: true
			}, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err); //错误，返回 err 信息
				}
				callback(null, user[0]); //成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

//读取用户信息
User.get = function(username, callback) {
	//打开数据库
	mongodb.open(function(err, mongodb) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 users 集合
		mongodb.collection('user', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//查找用户名（name键）值为 name 一个文档
			collection.findOne({
				username: username
			}, function(err, user) {
				mongodb.close();
				if (err) {
					return callback(err); //失败！返回 err 信息
				}
				callback('find', user); //成功！返回查询的用户信息
			});
		});
	});
};