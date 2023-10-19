import axios, {  AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

function TodoComp() {
    const [data, setData] =  useState<{id:number,task:string,status:number}[]>([]);
    const [name, setName] = useState("");
    const fetchData = async () => {
      try {
        const response:AxiosResponse = await axios.get("http://localhost:3000/api/v1/todo");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      fetchData();
    }, []);
    console.log(name);

    const handleAdd = async () => {
        if (name === "") {
          Swal.fire({
            icon: "error",
            title: "Không để trống!",
            timer: 2000,
          });
          return;
        }
        try {
          await axios.post(`http://localhost:3000/api/v1/todo`, {
            task: name
          });
          setName("");
          fetchData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Có lỗi xảy ra!",
          });
        }
      };
      const handleDelete = (id:number) => {
        Swal.fire({
          title: "Có chắc muốn xoá không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xoá",
          cancelButtonText: "Huỷ",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`http://localhost:3000/api/v1/todo/${id}`)
              .then(() => {
                
                Swal.fire({
                  icon: "success",
                  title: "Đã xoá!",
                  timer: 2000,
                });
                fetchData();
              })
              .catch((error) =>
                Swal.fire({
                  icon: "error",
                  title: "Có lỗi xảy ra!",
                  text: error,
                })
              );
          }
        });
      };

      const handleComplete = async (id:number) => {
        try {
          await axios.put(`http://localhost:3000/api/v1/todo/${id}`);
          fetchData();
          Swal.fire({
            icon: "success",
            title: "Đã cập nhật!",
            timer: 2000,
          });
        } catch (error) {
          console.log(error);
        }
      };
    
    return (
        <>
            <div className='mx-auto w-6/12 bg-red-400'>
                <div className='p-5'>
                    <p className='text-5xl text-stone-50'>Todo List</p>
                    <p className='text-gray-100'>Get things done, one item at a time</p>
                    <hr />
                </div>
                <div className='flex flex-col space-y-2'>
                    {data?.map((e,i)=><div key={i} className='flex justify-between py-3 px-5 bg-red-300'>
                        {e.status===1?<span className='text-gray-100 line-through'>{e.task}</span>:<span className='text-gray-100'>{e.task}</span>}
                        <div className='flex space-x-3 items-center'>
                            <input type="checkbox" name="complete" id="complete" defaultChecked={e.status === 1} onClick={()=>handleComplete(e.id)} />
                            <i className="fa-solid fa-trash" style={{ color: "#ffffff" }} onClick={()=>handleDelete(e.id)}></i>
                        </div>
                    </div>)}
                   
                </div>
                <div className='px-5 mt-3'>
                    <div className='flex justify-end'>
                        <span className='text-gray-100'>Move done items at the end?</span>
                    </div>
                </div>
                <div className='p-5'>
                    <label className='text-stone-50 text-xl' htmlFor="todo">Add to the todo list</label>
                    <div className="flex items-center">
                        <input type="text" name="todo" id="todo" className="h-10 px-3" onChange={(e)=>setName(e.target.value)}/>
                        <button className='text-stone-50 text-xl px-3 border-inherit border h-10'   onClick={handleAdd}>ADD ITEM</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default TodoComp