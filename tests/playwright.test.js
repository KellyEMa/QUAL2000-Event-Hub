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

test('scroll to browse main home page', async ({page}) => {

});

test('banner remains at top of screen', async ({page}) => {

});

//Admin Dash Tests

test('return to public site', async({page}) => {
    
});

test('login to admin dashboard', async({page}) => {

});

test('admin page navbar sticks to top', async({page}) =>{

});

test('admin nav bar add events loads add events page', async({page}) =>{

});

test('add new event button loads add event form', async({page}) =>{

});

test('created events in db display in all events page', async({page}) =>{

});

test('view public site', async({page}) =>{

});

test('back to admin from public site', async({page}) =>{

});

test('all events edit button', async({page}) =>{

});

test('save changes button', async({page}) =>{

});

test('event delete button', async({page}) =>{

});

test('admin login error', async({page}) =>{

});

test('password hidden', async({page}) =>{

});

//Add New Event Tests

test('cannot create event without name', async({page}) =>{

});

test.describe

test('cannot create event without date', async({page}) =>{

});

test('cannot create event with past date', async({page}) =>{

});

test('cannot create event without category', async({page}) =>{

});

test('cannot create event without image url', async({page}) =>{

});

test('cannot create event without description', async({page}) =>{

});

test('cannot create event without available slots', async({page}) =>{

});

test('event creation', async({page}) =>{

});

test('calender button appears', async({page}) =>{

});

//User Registration Tests 

test('create account button', async({page}) =>{

});

test('cannot create user without name', async({page}) =>{

});

test('cannot create user without email', async({page}) =>{

});

test('cannot create user without password', async({page}) =>{

});

test('password is hidden', async({page}) =>{

});

test('get user name', async({page}) =>{

});

test('get user email', async({page}) =>{

});

test('get password', async({page}) =>{

});

test('create account button', async({page}) =>{

});

test('already have an account button', async({page}) =>{

});

test('cannot create duplicate users', async({page}) =>{

});
//Login User Tests 

test('login button', async({page}) =>{

});

test('create account button', async({page}) =>{

});

test('cannot login without email', async({page}) =>{

});

test('cannot login without passowrd', async({page}) =>{

});

//User Portal Tests

test('browse more events button goes to events page', async({page}) =>{

});

test('open calender', async({page}) => {

});

test('edit user events', async({page}) =>{

});

test('edit reserved seats', async({page}) =>{

});

test('save', async({page}) =>{

});
//Events Tests

test('register to event button', async({page}) =>{

});

test('seat count', async({page}) =>{

});

test('cannot register to past events', async({page}) => {

});

//System Tests 

test('system running locally', async({page}) => {

});

test('ensure db connection is active', async({page}) =>{

});

test('starter data loads', async({page}) =>{

});