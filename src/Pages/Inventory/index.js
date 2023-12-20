import { useState, useEffect } from "react"
import { notification } from "antd"
import axios from "axios"
import { useAuthContext } from "../../hooks/useAuthContext"
import jwt_decode from "jwt-decode"

// const invent = [
//     {
//         "id": 1,
//         "itemName": "Test 1",
//         "itemSellPrice": 10,
//         "itemBuyPrice": 14,
//     },
//     {
//         "id": 2,
//         "itemName": "Test 2",
//         "itemSellPrice": 20,
//         "itemBuyPrice": 25,
//     },
//     {
//         "id": 3,
//         "itemName": "Test 3",
//         "itemSellPrice": 15,
//         "itemBuyPrice": 20,
//     },
//     {
//         "id": 4,
//         "itemName": "Test 4",
//         "itemSellPrice": 50,
//         "itemBuyPrice": 35,
//     },
//     {
//         "id": 5,
//         "itemName": "Test 5",
//         "itemSellPrice": 45,
//         "itemBuyPrice": 40,
//     }
// ]

const Index = () => {  // functional component begins
    const [itemName, setItemName] = useState('');
    const [itemSellPrice, setItemSellPrice] = useState('');
    const [itemBuyPrice, setItemBuyPrice] = useState('');
    const [error, setError] = useState({ //nitially, all properties are set to false, indicating that there are no errors in any of the form fields.
        itemName: false,
        itemSellPrice: false,
        itemBuyPrice: false
    });
    const [isEdit, setIsEdit] = useState(false);
    const [itemId, setItemId] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    // const [inventories, setInventories] = useState(invent);
    const [inventories, setInventories] = useState([]);
    const { dispatch, user } = useAuthContext()
    var userObject = jwt_decode(user)
    // console.log(userObject); 

    useEffect(() => {
        // Make a GET request to fetch inventory data from the backend
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:8080/app/item`,// Backend-API endpoint
            headers: { 
                'Authorization': 'Bearer '+user
            }
        };
        
        axios.request(config)
            .then((response) => {
                // Update the inventories state with the fetched data
                console.log("Data received:", response.data);
                setInventories(response.data);
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }, []); // empty dependency array [], which means the effect should run once when the component mounts


    const onChangeHandler = (e) => {
        let name = e.target.name;
        if (name === "itemName") {
            let value = e.target.value.trim();
            setItemName(value);
            if (value.length === 0) {
                setError((preState) => {
                    return {
                        ...preState,
                        itemName: true,
                    };
                });
            }
            else {
                setError((preState) => {
                    return {
                        ...preState,
                        itemName: false,
                    };
                });
            }
        } else if (name === 'itemSellPrice') {
            let value = e.target.value;
            setItemSellPrice(value);
            if (value.length === 0) {
                setError((preState) => {
                    return {
                        ...preState,
                        itemSellPrice: true,
                    };
                });
            }
            else {
                setError((preState) => {
                    return {
                        ...preState,
                        itemSellPrice: false,
                    };
                });
            }
        }
        else if (name === 'itemBuyPrice') {
            let value = e.target.value;
            setItemBuyPrice(value);
            if (value.length === 0) {
                setError((preState) => {
                    return {
                        ...preState,
                        itemBuyPrice: true,
                    };
                });
            }
            else {
                setError((preState) => {
                    return {
                        ...preState,
                        itemBuyPrice: false,
                    };
                });
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const postData = () => {
        if (
            itemName && itemName.trim() && itemBuyPrice && itemSellPrice &&
            Object.values(error).every(value => value === false)) {
            if (isEdit) {
                console.log("at edit", userObject.name)
                let data = JSON.stringify({
                    "itemId": itemId,
                    "itemName": itemName,
                    "itemEnteredByUser": userObject.name,
                    "itemEnteredDate": new Date(),
                    "itemBuyingPrice": itemBuyPrice,
                    "itemSellingPrice": itemSellPrice,
                    "itemLastModifiedDate": new Date(),
                    "itemLastModifiedByUser": userObject.name,
                    "itemStatus": "AVAILABLE"
                });
                let config = {
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `http://localhost:8080/app/item/${itemId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+user
                    },
                    data: data
                };
                axios.request(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                        setInventories((prevInventories) =>
                            prevInventories.map((inventoryItem) => {
                                if (inventoryItem.itemId === itemId) {
                                    return {
                                        ...inventoryItem,
                                        itemName: itemName,
                                        itemBuyingPrice: itemBuyPrice,
                                        itemSellingPrice: itemSellPrice,
                                    };
                                }
                                return inventoryItem;
                            })
                        );

                        api.success({
                            description: 'Item edited successfully.',
                            placement: 'topRight',
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        api.error({
                            description: 'Failed to edit the item',
                            placement: 'topRight'
                        })
                    });
            }
            else {
                console.log(inventories);
                let id  = inventories.length === 0 ? 1 : inventories[inventories.length - 1].itemId + 1; //to handle case when there aren't any items in db

                console.log("id is:", id);
                // console.log("inventory item name is:", itemName);
                // console.log("inventory item buy price is:", itemBuyPrice);
                // console.log("inventory item sell price is:", itemSellPrice);
                let data = JSON.stringify({
                    "itemId": id,
                    "itemName": itemName,
                    "itemEnteredByUser": userObject.name,
                    "itemEnteredDate": new Date(),
                    "itemBuyingPrice": itemBuyPrice,
                    "itemSellingPrice": itemSellPrice,
                    "itemLastModifiedDate": new Date(),
                    "itemLastModifiedByUser": userObject.name,
                    "itemStatus": "AVAILABLE"
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:8080/app/item',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+user
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                        setInventories((prevState) => [
                            ...prevState,
                            response.data,
                        ]);
                        api.success({
                            description: 'Item added successfully.',
                            placement: 'topRight',
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                        api.error({
                            description: 'Failed to insert item',
                            placement: 'topRight'
                        })
                    });



            }

            clearInputFields();
        }
        else {
            checkForError();
        }
    }

    const clearInputFields = () => {
        setItemName('');
        setItemSellPrice('');
        setItemBuyPrice('');
        setItemId(null);
        setIsEdit(false);
    }

    const checkForError = () => {
        if (!itemName) {
            setError((preState) => {
                return {
                    ...preState,
                    itemName: true,
                };
            });
        }
        if (!itemSellPrice) {
            setError((preState) => {
                return {
                    ...preState,
                    itemSellPrice: true,
                };
            });
        }
        if (!itemBuyPrice) {
            setError((preState) => {
                return {
                    ...preState,
                    itemBuyPrice: true,
                };
            });
        }
    };

    const editData = (id) => {
        console.log("received item id for edit: " + id)
        const inventory = inventories.find((i) => i.itemId === id);

        setItemId(inventory.itemId);
        setItemName(inventory.itemName);
        setItemSellPrice(inventory.itemSellingPrice);
        setItemBuyPrice(inventory.itemBuyingPrice);
        setIsEdit(true)
    }

    const deleteData = (id) => {
        console.log("received item id for deletion: " + id);
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `http://localhost:8080/app/item/${id}`,
            headers: {
                'Authorization': 'Bearer '+user
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setInventories(prevInventories => prevInventories.filter(i => i.itemId !== id));
                api.success({
                    description: 'Item Deleted successfully.',
                    placement: 'topRight',
                })

            })
            .catch((error) => {
                console.log(error);
                api.error({
                    description: 'Deletion Failed',
                    placement: 'topRight'
                })
            });

    }

    return (
        // component JSX here..returns the user Interface
        <div>
            {contextHolder}
            <h1>Inventory Management System</h1>
            <div className="form-view" style={{ marginLeft: '50px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group col-md-10">
                        <label className="d-flex" htmlFor="">Item Name</label>
                        <input type="text" className="form-control" placeholder="Item Name" name="itemName" value={itemName}
                            tabIndex="1"
                            onChange={(e) => {
                                setItemName(e.target.value);
                                setError((preState) => {
                                    return {
                                        ...preState,
                                        itemName: false
                                    }
                                })
                            }}
                            onBlur={(e) => onChangeHandler(e)} />
                        {!itemName && error.itemName ? (
                            <span className="text-danger">Item Name is required.</span>
                        ) : null}
                    </div>
                    <div className="form-group col-md-10">
                        <label className="d-flex">Item Selling Price</label>
                        <input type="number" className="form-control" placeholder="Selling Price" name="itemSellPrice" value={itemSellPrice}
                            tabIndex="2"
                            onChange={(e) => {
                                setItemSellPrice(e.target.value);
                                setError((preState) => {
                                    return {
                                        ...preState,
                                        itemSellPrice: false
                                    }
                                })
                            }}
                            onBlur={(e) => onChangeHandler(e)} />
                        {!itemSellPrice && error.itemSellPrice ? (
                            <span className="text-danger">Item Selling Price is required.</span>
                        ) : null}
                    </div>
                    <div className="form-group col-md-10">
                        <label className="d-flex">Item Buying Price</label>
                        <input type="number" className="form-control" placeholder="Buying Price" name="itemBuyPrice" value={itemBuyPrice}
                            tabIndex="2"
                            onChange={(e) => {
                                setItemBuyPrice(e.target.value);
                                setError((preState) => {
                                    return {
                                        ...preState,
                                        itemBuyPrice: false
                                    }
                                })
                            }}
                            onBlur={(e) => onChangeHandler(e)} />
                        {!itemBuyPrice && error.itemBuyPrice ? (
                            <span className="text-danger">Item Buying Price is required.</span>
                        ) : null}
                    </div>

                    <br></br>
                    <button onClick={postData} type="submit" className="btn btn-primary d-flex">Submit</button>

                </form>
            </div>
            <br></br>
            <div>
                {
                    inventories && inventories.length === 0 ? (
                        <>
                            No inventories present
                        </>
                    )
                        : (
                            <table className="table table-striped table-hover table-view">
                                <thead className="thead-formatting">
                                    <tr>
                                        <th scope="col">ItemName</th>
                                        <th scope="col">ItemSellingPrice</th>
                                        <th scope="col">ItemBuyingPrice</th>
                                        <th scope="col">AvailableStatus</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        inventories && inventories.map((inventory) => {
                                            return (
                                                <tr key={inventory.itemId}>
                                                    <td>{inventory.itemName}</td>
                                                    <td>{inventory.itemSellingPrice}</td>
                                                    <td>{inventory.itemBuyingPrice}</td>
                                                    <td>{inventory.itemStatus}</td>
                                                    <td><button onClick={() => { editData(inventory.itemId) }} type="submit" className="btn btn-primary">Edit</button> {" "}
                                                        <button onClick={() => { deleteData(inventory.itemId) }} type="submit" className="btn btn-primary">Delete</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        )
                }

            </div>
        </div>
    )
}//functional component ends

export default Index //export the component