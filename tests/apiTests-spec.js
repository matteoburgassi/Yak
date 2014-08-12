/**
 * Created by matteo on 08/08/14.
 */
var frisby = require('/usr/lib/node_modules/frisby');

frisby.create('destroy all test db')
	.delete('http://127.0.0.1:3001/documents/testUtil/destroy')
	.expectStatus(204)
	.toss();

frisby.create('ensure that list is empty now')
	.get('http://127.0.0.1:3001/documents')
	.expectStatus(200)
	.afterJSON(function(doc){
		expect(doc._items.length = 0)
	})
	.toss();

frisby.create('create a document')
	.post('http://127.0.0.1:3001/documents',
		createMockJSON(),
		{
			json: true
		}
	)
	.expectStatus(201)
	.toss();

frisby.create('ensure cannot create two document with equal name')
	.post('http://127.0.0.1:3001/documents',
		createMockJSON(),
		{
			json: true
		}
	)
	.expectStatus(500)
	.toss();

frisby.create('ensure that list is not empty now')
	.get('http://127.0.0.1:3001/documents')
	.expectStatus(200)
	.afterJSON(function(doc){
		expect(doc._items[0].name = "prova")
	})
	.toss()

insertTenElements();
testFindADoc(Math.floor(Math.random() * 10));
testUpdateADoc(Math.floor(Math.random() * 10));
testDeleteADoc(Math.floor(Math.random() * 10));

function createMockJSON(i){
	if(i){
		return {
			"name": "prova" + i,
			"description": "this is a test " + i +" document",
			"authors": [
			{
				"name": "Matteo",
				"email": "matteoburgassi@gmail.com"
			}
		],
			"images": []
		}
	} else {
		return {
			"name": "prova",
			"description": "this is a test document",
			"authors": [
				{
					"name": "Matteo",
					"email": "matteoburgassi@gmail.com"
				}
			],
			"images": []
		}
	}
}

function insertTenElements(){
	frisby.create('re destroy test db')
		.delete('http://127.0.0.1:3001/documents/testUtil/destroy')
		.toss();
	for (i =0; i<10; i++){
		frisby.create('create a document ' + i)
			.post('http://127.0.0.1:3001/documents',
			createMockJSON(i),
			{
				json: true
			}
		)
		.toss();
	}
}

function testFindADoc(indexFromZeroToNine){
	var title;
	if(indexFromZeroToNine){
		frisby.create('find a doc')
			.get('http://127.0.0.1:3001/documents')
			.afterJSON(function(doc){
				title = doc._items[indexFromZeroToNine].name;
				frisby.create('find the element by name')
					.get('http://127.0.0.1:3001/documents/'+title)
					.expectStatus(200)
					.afterJSON(function(doc){
						expect(doc[0].name = title);
					})
					.toss()
			})
			.toss()
	}
}

function testUpdateADoc(indexFromZeroToNine){
	var retrieved;
	if(indexFromZeroToNine){
		frisby.create('update a doc')
			.get('http://127.0.0.1:3001/documents')
			.afterJSON(function(doc){
				retrieved = doc._items[indexFromZeroToNine];
				retrieved.description = "modified description"
				frisby.create('update the element')
					.put('http://127.0.0.1:3001/documents/'+retrieved.name,
						retrieved,
						{
							json: true
						}
					)
					.expectStatus(303)
					.toss()
			})
			.toss()
	}
}

function testDeleteADoc(indexFromZeroToNine){
	var retrieved;
	if(indexFromZeroToNine){
		frisby.create('delete a doc')
			.get('http://127.0.0.1:3001/documents')
			.afterJSON(function(doc){
				retrieved = doc._items[indexFromZeroToNine];
				retrieved.description = "modified description"
				frisby.create('update the element')
					.delete('http://127.0.0.1:3001/documents/'+retrieved.name)
				.expectStatus(204)
				.toss()
			})
			.toss()
	}
}