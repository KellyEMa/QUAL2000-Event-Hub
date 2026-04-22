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

const adminUser = {
    username: 'admin',
    password: 'adminPass'
};

const testUser = {
    name: 'Brynn',
    email: 'fake@email.com',
    password: 'Password',
};

const testID = '69da564f2cc8da6bd71d2307'


//Home Page Tests

test('hompage loads', async ({page}) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL('http://localhost:3000/');
});

//toHaveURL found in https://playwright.dev/docs/test-assertions

test('home reloads', async({page}) => {
    await page.goto('http://localhost:3000');
    await page.reload();
    await expect(page).toHaveURL('http://localhost:3000/');
    
});

test('live guide event hub', async ({page}) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('link', {name: 'live guide event hub'}).click();
    await expect(page).toHaveURL('http://localhost:3000/');
});

//test('scroll to browse main home page', async ({page}) => {

//});

//test('banner remains at top of screen', async ({page}) => {

//});

//Admin Dash Tests

test('access admin dash login', async({page}) =>{
    await page.goto('http://localhost:3000');
    await page.getByRole('link', {name: 'Admin Dashboard'}).click();

    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/admin/events');

})

test('return to public site', async({page}) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events');
    await page.getByRole('link',{name: 'View Public Site'} ).click();
    await expect(page).toHaveURL('http://localhost:3000/events');

});

test('login to admin dashboard', async({page}) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/admin/events');
    
});

//test('admin page navbar sticks to top', async({page}) =>{

//});

test('admin nav bar add events loads add events page', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events');
    await page.getByRole('link', {name:'Add New Event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')
    
});

test('add new event button loads add event form', async({page}) =>{
    await page.goto('http://localhost:3000/admin/events/new');
    await expect(page.getByText('Add a new event')).toBeVisible
    
});

//test('created events in db display in all events page', async({page}) =>{
    
//});

test('view public site', async({page}) =>{
    await page.goto('http://localhost:3000/events');
});

test('back to admin from public site', async({page}) =>{
    await page.goto('http://localhost:3000/admin/events');
});

test('all events edit button', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events');
    await expect(page.getByRole('link',{name: 'Edit'}).first()).toBeVisible();
    
});
// .first https://playwright.dev/docs/api/class-locatorassertions#:~:text=To%20check%20that%20at%20least,)%20Added%20in:%20v1.18

test('save changes button', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto(`http://localhost:3000/admin/events`);
    await page.getByRole('link',{name: 'Edit'}).first().click();
    await page.getByLabel('Available Slots').fill('10');
    await page.getByRole('button', {name: 'Save Changes'}).click();
    await expect(page).toHaveURL(`http://localhost:3000/admin/events`);
});

test('event delete button', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.getByRole('button',{name: 'Delete'}).first().click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events?message=Event%20deleted%20successfully.');
});

//test('admin login error', async({page}) =>{
    
//});

test('password hidden', async({page}) =>{

});

//Add New Event Tests

test('cannot create event without name', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    await page.fill('#description', 'testing 123');
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')
});



test('cannot create event without date', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    await page.fill('#description', 'testing 123');
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')
});



//test('cannot create event with past date', async({page}) =>{
    //await expect(page.getByLabel('name')).not.toBeEmpty();

//});

test('cannot create event without category', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
   
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    await page.fill('#description', 'testing 123');
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')

});

test('cannot create event without image url', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#description', 'testing 123');
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')

});

test('cannot create event without description', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')

});

test('cannot create event without available slots', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    await page.fill('#description', 'testing 123');
   
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events/new')

});

test('event creation', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events/new');
    await page.fill('#title', 'test');
    await page.fill('#date', '2025-05-01');
    await page.fill('#location', 'Kingston');
    await page.fill('#category', 'test');
    await page.fill('#image', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGR8bGRgYGB4fHhogGxsiHyAjISAdHyggHSAlHx4iIjEhJSorLi4uGyAzODMtNygtLisBCgoKDg0OGxAQGzImICYvLzAuMi0tLS8tMTItLS0tLS8wLS0tLSsvMi81LS0tLS8yLS0tLy8vLy8vLS8tLy0vLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYCAwcBAAj/xABHEAACAQIEAwYDBAcGBQMFAQABAhEDIQAEEjEFQVEGEyJhcYEykaFCUrHwFCNicpLB0QcVM4Lh8TRTorLSJENzY4OTo7MW/8QAGwEAAwEBAQEBAAAAAAAAAAAAAwQFAgEGAAf/xAA7EQABAwEFBQgBAwMDBQEBAAABAgMRAAQSITFBUWFxkfAFEyKBobHB0eEUMvEjQlIGM3IVJGKCkjSi/9oADAMBAAIRAxEAPwDmfBaFN2JLd3pE6mUsB0+EhtUxETjDiroAgmdn5020ZRNWXDuAZlhrp1rRqZqlJxCjnNUgwfK++JbvaFlQsAjGYF2DicP7RWUtLUIzrIcKqMdTBA42cMKRE+ax8ica/WMI8OPAx7fxTv8A0u1QDKcdk+4/NH0+BUhQqtrcSNNamWVhpqHT3qmATpJ1XmCnmDjX/UVF1sIQMcUHaU43TpiAU+dJu2dTE94rLPdPLjXOM9latF3pP4XpyGE+cW8mBkHmDOPbh9q1WdDiMUqgj35iPI0rdKVEHOskzdWpTKTMENJNzpDCJ6RPyGFHGkNPod3RuxIrd7wkV7k8kXlmbu0WNTMQTJ2CqLkmLb7YK7a3JuHw+54dedAJuplIn2HGrfs92Vr1rokU+VSqtyvKEJINudx5iMeb7S7Us9nNxxUq/wAU5+ZER6edabLzv+0IH+Ry8hT7K8M4cCf0nMPUKmCCfjP7I2CiNzadjbBLCq1PIvlsI');
    await page.fill('#description', 'testing 123');
    await page.fill('#avalilableSlots', '10');
    await page.getByRole('button', {name: 'create event'}).click();
    await expect(page).toHaveURL('http://localhost:3000/admin/events')
});

test('calender button appears', async({page}) =>{
    await page.goto('http://localhost:3000/admin/login');
    await page.getByLabel('Admin Username').fill(adminUser.username);
    await page.getByLabel('Admin Password').fill(adminUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/admin/events');
    await expect(page.getByLabel('calender')).toBeVisible();
});

//User Registration Tests 

test('create account page button', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await expect(page.getByText('Create your account')).toBeVisible();
    
});

test('cannot create user without name', async({page}) =>{
    await page.goto('http://localhost:3000/register');
   
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'create account'}).click();
    await expect(page).toHaveURL('http://localhost:3000/register');

});

test('cannot create user without email', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#name', testUser.name);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'create account'}).click();
    await expect(page).toHaveURL('http://localhost:3000/register');

});

test('cannot create user without password', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.getByRole('button', {name: 'create account'}).click();
    await expect(page).toHaveURL('http://localhost:3000/register');

});

test('password is hidden', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');

});

test('get user name', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#name', testUser.name);
    await page.getByLabel('username');
});

test('get user email', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#email', testUser.email);
    await page.getByLabel('email');
});

test('get password', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#password', testUser.password);
    await page.getByLabel('password');

});

test('create account button', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: "create account"}).click();
    await expect(page).toHaveURL('http://localhost:3000/events/registrations')
    
});

test('already have an account button', async({page}) =>{
    await page.goto('http://localhost:3000/register');
    await page.getByRole('button',{name:"Already Have An Account?"})
    await page.goto('http://localhost:3000/events/login')
    
});

test('cannot create duplicate users', async({page}) =>{
await page.goto('http://localhost:3000/register');
    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: "create account"}).click();
    await expect(page).toHaveURL('http://localhost:3000/register');
});
//Login User Tests 

test('login button', async({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();
    await expect(page).toHaveURL('http://localhost:3000/events/registrations')
});


test('cannot login without email', async({page}) =>{
    await page.goto('http://localhost:3000/login');
    
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();
    await expect(page).toHaveURL('http://localhost:3000/login');

});

test('cannot login without passowrd', async({page}) =>{
    await page.goto('http://localhost:3000/login');

    await page.fill('#email', testUser.email);
    await page.getByRole('button', {name: 'Log In'}).click();
    await expect(page).toHaveURL('http://localhost:3000/login');

});

//User Portal Tests

test('browse more events button goes to events page', async({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();

    await page.goto('http://localhost:3000/events/registrations');
    await page.getByRole('link', {name: 'Browse Events'}).click();
    await expect(page).toHaveURL('http://localhost:3000/events');
    
});

test('open calender', async({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();

    await page.goto('http://localhost:3000/events/registrations/calendar')
    await page.getByRole('button', {name: 'calendar'}).click();
    await page.getByRole('form', {name: 'calendar'}).isVisible();
});

test('edit user events', async({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();

    await page.goto(`http://localhost:3000/events/registrations/${testID}/edit`);
    await page.getByRole('link', {name: 'edit user events'}).click();
   
});

test('edit reserved seats', async({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.getByRole('button', {name: 'Log In'}).click();

    await page.goto(`http://localhost:3000/events/registrations/${testID}/edit`);
    await page.getByRole('button', {name: 'edit seats'}).click();
    await page.getByRole('form', {name: 'reserved seats'}).isVisible();
});

//test('save', async({page}) =>{

//});

//Events Tests

test('register to event button', async({page}) =>{
    await page.goto(`http://localhost:3000/events/${testID}/register`)
    await page.getByRole('button', {name: 'register'}).click();
});

//test('seat count', async({page}) =>{

//});

//test('cannot register to past events', async({page}) => {

//});

//System Tests 

test('system running locally', async({page}) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL('http://localhost:3000');
});

//test('ensure db connection is active', async({page}) =>{

//});

//test('starter data loads', async({page}) =>{

//});