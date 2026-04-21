// @ts-check
import { test, expect } from '@playwright/test';

const {
    buildCalendarRows,
    createPasswordHash,
    getMonthStart,
    getMonthValue,
    getNextMonthValue,
    getPreviousMonthValue,
    groupRegistrationsByDate,
    isPastEvent,
    normalizeSeatCount,
    passwordMatches,
} = require("../appHelpers");


//Home Page Tests

test('hompage loads', async ({page}) => {
    await page.goto('localhost:3000');
})

test('home reloads', async({page}) => {
    await page.getByRole('link', {name: 'Home'}).click();
    
});

test('live guide event hub', async ({page}) => {
    await page.getByRole('link', {name: 'live guide event hub'}).click();
});

//test('scroll to browse main home page', async ({page}) => {

//});

//test('banner remains at top of screen', async ({page}) => {

//});

//Admin Dash Tests

test('return to public site', async({page}) => {
    await page.goto('localhost:3000');

});

test('login to admin dashboard', async({page}) => {
    await page.getByRole('link', {name: 'login'}).click();
    await page.goto('localhost:3000/login');
});

//test('admin page navbar sticks to top', async({page}) =>{

//});

test('admin nav bar add events loads add events page', async({page}) =>{
    await page.getByRole('link', {name:'add events'}).click();
    await page.goto('localhost:3000/add-events');
});

test('add new event button loads add event form', async({page}) =>{
    await page.getByRole("link", {name: 'add new event'}).click();
    await page.goto('localhost:3000/add-events');
});

//test('created events in db display in all events page', async({page}) =>{
    
//});

test('view public site', async({page}) =>{
    await page.goto('localhost:3000');
});

test('back to admin from public site', async({page}) =>{
    await page.goto('localhost:3000/admin');
});

test('all events edit button', async({page}) =>{
    await page.getByRole('link', {name: 'all events edit'}).click();
    await page.goto('localhost:3000/edit-events');
});

test('save changes button', async({page}) =>{
    await page.getByRole('button',{name: 'save'});
});

test('event delete button', async({page}) =>{
    await page.getByRole('button', {name: 'delete'});
});

//test('admin login error', async({page}) =>{
    
//});

test('password hidden', async({page}) =>{

});

//Add New Event Tests

test('cannot create event without name', async({page}) =>{
    await expect(page.getByLabel('name')).not.toBeEmpty();

});

test('cannot create event without date', async({page}) =>{
    await expect(page.getByLabel('date')).not.toBeEmpty();

});

//test('cannot create event with past date', async({page}) =>{
    //await expect(page.getByLabel('name')).not.toBeEmpty();

//});

test('cannot create event without category', async({page}) =>{
    await expect(page.getByLabel('category')).not.toBeEmpty();

});

test('cannot create event without image url', async({page}) =>{
    await expect(page.getByLabel('image')).not.toBeEmpty();

});

test('cannot create event without description', async({page}) =>{
    await expect(page.getByLabel('description')).not.toBeEmpty();

});

test('cannot create event without available slots', async({page}) =>{
    await expect(page.getByLabel('available slots')).not.toBeEmpty();

});

test('event creation', async({page}) =>{
    await page.getByRole('button', {name: 'create event'}).click();
});

test('calender button appears', async({page}) =>{
    await expect(page.getByLabel('calender')).toBeVisible;
});

//User Registration Tests 

test('create account button', async({page}) =>{
    await page.getByRole('link', {name: "create an account"});
    await page.goto('localhost:3000/create-account');
});

test('cannot create user without name', async({page}) =>{
     await expect(page.getByLabel('username')).not.toBeEmpty();

});

test('cannot create user without email', async({page}) =>{
    await expect(page.getByLabel('email')).not.toBeEmpty();

});

test('cannot create user without password', async({page}) =>{
    await expect(page.getByLabel('password')).not.toBeEmpty();

});

test('password is hidden', async({page}) =>{
    await page.getByLabel('password').fill('*******');

});

test('get user name', async({page}) =>{
    await page.getByLabel('username');
});

test('get user email', async({page}) =>{
    await page.getByLabel('email');
});

test('get password', async({page}) =>{
    await page.getByLabel('password');

});

test('create account button', async({page}) =>{
    await page.getByRole('button', {name: "create account"}).click();
    await
});

test('already have an account button', async({page}) =>{
    await page.getByRole('link', {name:'already have an accout'}).click();
    await page.goto('localhost:3000/login');
});

test('cannot create duplicate users', async({page}) =>{

});
//Login User Tests 

test('login button', async({page}) =>{
    await page.getByRole('link')
});


test('cannot login without email', async({page}) =>{
    await expect(page.getByLabel('email')).not.toBeEmpty();

});

test('cannot login without passowrd', async({page}) =>{
    await expect(page.getByLabel('password')).not.toBeEmpty();

});

//User Portal Tests

test('browse more events button goes to events page', async({page}) =>{
    await page.getByRole('link', {name: 'browse more events'});
    await page.goto('localhost:3000/events')
});

test('open calender', async({page}) => {
    await page.getByRole('button', {name: 'calender'}).click();
    await page.getByRole('form', {name: 'calender'}).isVisible();
});

test('edit user events', async({page}) =>{
    await page.getByRole('link', {name: 'edit user events'});
    await page.goto('localhost:3000/edit');
});

test('edit reserved seats', async({page}) =>{
    await page.getByRole('button', {name: 'edit seats'}).click();
    await page.getByRole('form', {name: 'reserved seats'}).isVisible();
});

//test('save', async({page}) =>{

//});

//Events Tests

test('register to event button', async({page}) =>{
    await page.getByRole('button', {name: 'register'}).click();
});

//test('seat count', async({page}) =>{

//});

//test('cannot register to past events', async({page}) => {

//});

//System Tests 

test('system running locally', async({page}) => {
    await page.goto('localhost:3000');
});

//test('ensure db connection is active', async({page}) =>{

//});

//test('starter data loads', async({page}) =>{

//});