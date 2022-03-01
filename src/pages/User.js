import React from "react"
import {Modal} from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";


class User extends React.Component{
    constructor(){
        super()
        this.state = {
            users : [
                {
                    id_user: "123", nama : "Indah Nisa",
                    username: "indah", password: "1234",
                    role : "Admin"
                    
                },
                {
                    id_user: "124", nama : "Louis Clara",
                    username: "louis", password: "1234",
                    role : "Kasir"
                    
                },
                {
                    id_user: "125", nama : "Dewanti Putri",
                    username: "dewanti", password: "1234",
                    role : "Admin"
                    
                }
            ],
            id_user:"",
            nama:"",
            username :"",
            password:"",
            role:"",
            visible:true
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData(){
        //memunculkan modal
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mengosongkan inputannya
        this.setState({
            nama:"", username:"", password:"", role:"",
            id_user: Math.random(1,1000000), action:"tambah"
        })
    }

    
    ubahData(id_user){
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mencari posisi index dari data user berdasarkan id_user pada array users
    let index = this.state.users.findIndex(user => user.id_user === id_user)

    this.setState({
        id_user : this.state.users[index].id_user,
        nama : this.state.users[index].nama,
        username : this.state.users[index].username,
        password : this.state.users[index].password,
        role : this.state.users[index].role,
        action : "ubah"
        })
    }
    


    simpanData(event){
        event.preventDefault()
        //mencegah berjalannya aksi default
        //dari form submit

        //menghilangkan Modalnya
        this.modalUser.hide()
        //cek aksi tambah atau ubah
        if(this.state.action === "tambah"){
            let endpoint = `${baseUrl}/users`
            //menampung data dari pengguna
            let newUser = {
                id_user: this.state.id_user,
                nama : this.state.nama,
                username : this.state.username,
                password : this.state.password,
                role : this.state.role
            } 

            // let temp = this.state.users
            // temp.push(newUser)

            // this.setState({users : temp})
            axios.post(endpoint, newUser, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch (error => console.log(error))

        }else if(this.state.action === "ubah"){
            this.modalUser.hide()
            let endpoint = `${baseUrl}/users/` + this.state.id_user
            //mencari posisi index dari data user berdasarkan id_user pada array users
            // let index = this.state.users.findIndex(user => user.id_user === this.state.id_user)

            // let temp = this.state.users
            // temp[index].nama = this.state.nama
            // temp[index].username = this.state.username
            // temp[index].password = this.state.password
            // temp[index].role = this.state.role

            // this.setState({users: temp})
            let newUser = {
                id_user: this.state.id_user,
                nama : this.state.nama,
                username : this.state.username,
                password : this.state.password,
                role : this.state.role
            } 
            axios.put(endpoint, newUser, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch (error => console.log(error))
        }
    }
    hapusData(id_user){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            let endpoint = `${baseUrl}/users/` + id_user
            //mencari posisi index dari data yang dihapus
            // let temp = this.state.users
            // let index = temp.findIndex(user => user.id_user === id_user)

            // temp.splice(index, 1)

            // this.setState({users: temp})
            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch (error => console.log(error))
        }
    }

    getData(){
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({users: response.data})
            })
            .catch(error => console.log(error))
    }

    componentDidMount(){
        //fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if(user.role === 'admin'){
            this.setState({
            visible:true
        })
        }else{
            this.setState({
            visible:false
        })
        }
    }

    render(){
        return (
            <div className="container">
            <div className="card">
                <div className="card-header bg-dark">
                    <h4 className="text-white">
                        List Data User
                    </h4>
                </div>

                <div className="card-body">
                <div className="d-grid gap-2 d-md-flex justify-content-md-end" >
                <button className="btn btn-success mb-4"
                onClick={() => this.tambahData()}>Tambah user</button>
            </div>
                    <ul className="list-group">
                        {this.state.users.map(user => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/* bagian untuk nama */}
                                    <div className="col-lg-4">
                                        <small className="text-info">Nama</small> <br />
                                        {user.nama}
                                    </div>
                                    {/* bagian untuk  username*/}
                                    <div className="col-lg-2">
                                        <small className="text-info">Username</small> <br />
                                        {user.username}
                                    </div>
                                    {/* bagian untuk password */}
                                    <div className="col-lg-2">
                                        <small className="text-info">Password</small> <br />
                                        {user.password}
                                    </div>
                                    {/* bagian untuk role */}
                                    <div className="col-lg-2">
                                        <small className="text-info">Role</small> <br />
                                        {user.role}
                                    </div>
                                    {/* bagian untuk button */}
                                    <div className="col-lg-2">
                                        <button className="btn btn-warning btn-sm mt-4 mx-2"
                                        onClick={() => this.ubahData(user.id_user)}>Edit </button>
                                        <button className="btn btn-danger btn-sm mt-4"
                                        onClick={() => this.hapusData(user.id_user)}>Delete </button>
                                    </div>
                                    {/* bagian untuk alamat */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* form modal User */}
                <div className="modal" id="modal-user">
                    <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h4 className="text-white">
                                        Form Tambah User
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}> 
                                        Nama 
                                        <input type="text" className="form-control mb-2" 
                                        value={this.state.nama}
                                        onChange={ev => this.setState({nama: ev.target.value})}
                                        required />

                                        Username
                                        <input type="text" className="form-control mb-2" 
                                        value={this.state.username}
                                        onChange={ev => this.setState({username: ev.target.value})}
                                        required />

                                        Password
                                        <input type="text" className="form-control mb-2" 
                                        value={this.state.password}
                                        onChange={ev => this.setState({password: ev.target.value})}
                                        required />

                                        Role
                                        <select className="form-control mb-2"
                                        value={this.state.role}
                                        onChange={ev => this.setState({role: ev.target.value})}>
                                            <option value="Admin">Admin</option>
                                            <option value="Kasir">Kasir</option>
                                        </select>

                                        <button className="btn btn-success btn-sm" 
                                        type="submit">Simpan</button>
                                    </form>
                                </div>
                            </div>
                      </div>
                </div>
        </div>
    </div>
        )
    }
}

export default User