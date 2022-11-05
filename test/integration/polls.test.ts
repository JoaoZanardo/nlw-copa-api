describe('Poll integration test', () => {
    const pollData = {
        title: 'Test poll'
    }

    it('should create a new poll', async () => {
        const polls = await global.testRequest.get('/polls');
        expect(polls).toEqual([]);
    });
});