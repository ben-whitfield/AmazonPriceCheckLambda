import { handler } from '../lib/index';

import * as utilities from '../lib/utilities';
jest.mock('../lib/utilities.ts');

const mockUtilities = utilities as jest.Mocked<typeof utilities>; // make TS happy

mockUtilities.getWishList.mockImplementation(()=> {
  return Promise.resolve(
    {
      statusText: "ok", 
      headers: {}, 
      status: 200, 
      config: {}, 
      data:[{"productUrl": "http://www.foo.com", "desiredPrice": 5}]
    }
  )
})

mockUtilities.getProductPromises.mockImplementation(()=> {
  return [Promise.resolve(
    {
      statusText: "ok", 
      headers: {}, 
      status: 200, 
      config: {}, 
      response: {
        data:"<SomeHTML></SomeHTML>"
      },
      desiredPrice:10
    }
  )]
})

mockUtilities.extractPrice.mockImplementation(()=> {
  return 10
})

mockUtilities.extractTitle.mockImplementation(()=> {
  return 'The title'
})


describe("wiring it all together", () => {
  
  beforeEach(()=> {
    return handler();
  });

  test("that the wishList function gets called", () => {
    expect(mockUtilities.getWishList).toHaveBeenCalled();
  });

  test("that the productPromises function gets called", () => {
    expect(mockUtilities.getProductPromises).toHaveBeenCalledWith([{"productUrl": "http://www.foo.com", "desiredPrice": 5}]);
    expect(mockUtilities.getProductPromises).toHaveBeenCalled();
  });

  test('that the extraction functions run', () => {
    expect(mockUtilities.extractPrice).toHaveBeenCalled();
    expect(mockUtilities.extractTitle).toHaveBeenCalled();
    expect(mockUtilities.extractPrice).toHaveBeenCalledWith('<SomeHTML></SomeHTML>');
    expect(mockUtilities.extractTitle).toHaveBeenCalledWith('<SomeHTML></SomeHTML>');
    expect(mockUtilities.extractPrice).toHaveBeenCalledTimes(1)
    expect(mockUtilities.extractTitle).toHaveBeenCalledTimes(1)
  })

  test('that the create message function runs', () => {
    expect(mockUtilities.createMessageBody).toHaveBeenCalled();
    expect(mockUtilities.createMessageBody).toHaveBeenCalledTimes(1);
  })

  test('that the create message function is called correctly', () => {
    expect(mockUtilities.createMessageBody).toHaveBeenCalledWith([{"title":"The title", "price":10, "desiredPrice":10}]);
  })

  test('that the send message function runs', () => {
    expect(mockUtilities.sendMessage).toHaveBeenCalled();
    expect(mockUtilities.sendMessage).toHaveBeenCalledTimes(1);
  })

});
