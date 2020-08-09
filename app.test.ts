import app from './src/app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {expect, request} from 'chai';

chai.use(chaiHttp);

describe('YouTube comment downloader', () => {
    it('should correctly POST /submit for YouTube urls', () => {
        return request(app)
        .post('/submit')
        .send({url:'https://www.youtube.com/watch?v=BjZbAzUM9Ao'})
        .then(res => {
            expect(res).to.have.status(200);
        });
    });

    it('should throw error for YouTube urls with no video Id', () => {
        return request(app).post('/submit').send({url:'https://www.youtube.com'}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Invalid youtube URL, please try again');
        });
    });

    it('should throw error for non YouTube urls', () => {
        return request(app).post('/submit').send({url:'https://www.google.com'}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Invalid URL, please try again');
        });
    });

    it('should throw error for non string values', () => {
        return request(app).post('/submit').send({url: 465}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Please enter a valid youtube or amazon URL');
        });
    });

});

describe('Amazon review downloader', () => {
    it('should correctly POST /submit for Amazon urls', () => {
        return request(app).post('/submit').send({url:'https://www.amazon.com/Argan-Treatment-Color-Treated-eSalon/dp/B00SI0MCL4/ref=sr_1_2_a_it?ie=UTF8&qid=1489250924&sr=8-2&keywords=esalon'})
        .then(res => {
            expect(res).to.have.status(200);
        });
    });

    it('should throw error for Amazon urls with no product Id', () => {
        return chai.request(app).post('/submit').send({url:'https://www.amazon.com'}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Invalid Amazon URL, please try again');
        });
    });

    it('should throw error for non Amazon urls', () => {
        return chai.request(app).post('/submit').send({url:'https://www.google.com'}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Invalid URL, please try again');
        });
    });

    it('should throw error for non string values', () => {
        return chai.request(app).post('/submit').send({url: 465}).then(res => {
            expect(res).to.have.status(400);
            expect(res.text).to.eql('Please enter a valid youtube or amazon URL');
        });
    });
});
