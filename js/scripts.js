/* eslint-disable no-undef */
function AddressBook() {
	this.contacts = [],
	this.currentId = 0
}

AddressBook.prototype.addContact = function(contact) {
	contact.id = this.assignId();
	this.contacts.push(contact);
};

AddressBook.prototype.assignId = function() {
	this.currentId += 1;
	return this.currentId;
};

AddressBook.prototype.findContact = function(id) {
	for(var i = 0; i < this.contacts.length; i++) {
		if(this.contacts[i]) {
			if(this.contacts[i].id == id) {
				return this.contacts[i];
			}
		}
	}
	return false;
};

AddressBook.prototype.deleteContact = function(id) {
	for(var i = 0; i < this.contacts.length; i++) {
		if(this.contacts[i]) {
			if(this.contacts[i].id == id) {
				delete this.contacts[i];
				return true;
			}
		}
	}
	return false;
};

function Contact(firstName, lastName, phoneNumber) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.phoneNumber = phoneNumber;
	this.address = []
}

function Address(address, type) {
	this.address = address,
	this.type = type
}

Contact.prototype.fullName = function() {
	return this.firstName + ' ' + this.lastName;
};

Contact.prototype.addAddress = function(add, type) {
	this.address.push(new Address(add, type));
}

var addressBook = new AddressBook();

function displayContactDetails(addressBookToDisplay) {
	var contactsList = $('ul#contacts');
	var htmlForContactInfo = '';
	addressBookToDisplay.contacts.forEach(function(contact) {
		htmlForContactInfo += '<li id=' + contact.id + '>' + contact.firstName + ' ' + contact.lastName + '</li>';
	});
	contactsList.html(htmlForContactInfo);
}

function showContact(contactId) {
	var contact = addressBook.findContact(contactId);
	$('#show-contact').show();
	$('.first-name').html(contact.firstName);
	$('.last-name').html(contact.lastName);
	$('.phone-number').html(contact.phoneNumber);
	contact.address.forEach(function(address) {
		$('#add').append('<p>' + address.type + ': ' + address.address + '</p>');  //"append" might not be right.. goal is to refresh everything
	});
	var buttons = $('#buttons');
	buttons.empty();
	buttons.append('<button class="delete-button" id=' + contact.id + '>Delete</button>');
	buttons.append('<button class="add-address-button" id=' + contact.id + '>Add Address</button>');
}

function attachContactListeners() {
	$('ul#contacts').on('click', 'li', function() {
		showContact(this.id);
	});
	$('#buttons').on('click', '.delete-button', function() {

		addressBook.deleteContact(this.id);
		$('#show-contact').hide();
		displayContactDetails(addressBook);
	});
	$('#buttons').off().on('click', '.add-address-button', function() {
		if($('.hidden').length < 1) {
			console.log("test");
			$('.showing').attr('class', 'hidden');
			contact = addressBook.findContact(this.id);
			contact.addAddress($('input#address-add').val(), $('#add-address-type option:selected').text());
			displayContactDetails(addressBook);
			$('input#address-add').val('');
			$('input#add-address-type').val('');
			showContact(this.id);
		} else {
			$('.hidden').attr('class', 'showing');
		}
	});
}

$(function() {
	attachContactListeners();
	$('form#new-contact').submit(function(event) {
		event.preventDefault();
		var inputtedFirstName = $('input#new-first-name').val();
		var inputtedLastName = $('input#new-last-name').val();
		var inputtedPhoneNumber = $('input#new-phone-number').val();

		$('input#new-first-name').val('');
		$('input#new-last-name').val('');
		$('input#new-phone-number').val('');

		var newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber);
		addressBook.addContact(newContact);
		displayContactDetails(addressBook);
	});
});
