
import { useEffect, useState } from "react";
import { fetchUserList } from "../../api-client";
import { Table, Progress, Switch, Tag, Space, Popconfirm, Input } from "antd"
//flag list
const Users = ({ keycloak, selectedProject, setContentClick }) => {

   const [users, setusers] = useState([]);


   useEffect(() => {
      if (!selectedProject) {
         return
      }
      fetchUserList(keycloak.token, selectedProject).then((users) => {
        setusers(users);
      }).catch(console.error);
   }, [selectedProject]);



   const columns = [
      
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
     },
    {
         title: 'Name',
         dataIndex: 'firstName',
         key: 'firstName',
         render: (text, record) =>
            record.firstName+" "+record.lastName,
      },
      {
         title: 'enabled',
         dataIndex: 'enabled',
         key: 'enabled',
         render: (text, record) =>
            <Switch checked={text} />,
      },
   ];

   const [value, setValue] = useState('');
   const [originalFeatures, setOriginalFeatures] = useState(users); // Backup of the original data
   const [filteredFeatures, setFilteredFeatures] = useState(users); // Data for display (filtered or original)
   
   const onSearch = (event) => {
      const currValue = event.target.value;
      setValue(currValue);

      if (currValue === "") {
         // Restore the original list when input is cleared
         setFilteredFeatures(originalFeatures);
      } else {
         const filteredData = originalFeatures.filter(entry =>
            entry.username.includes(currValue)
         );
         setFilteredFeatures(filteredData);
      }
   }

   useEffect(() => {
      setOriginalFeatures(users); // Keep a copy of the original unfiltered list
      setFilteredFeatures(users); // Initialize the displayed list

      if(users?.length > 0){
        console.log("users");
        console.log(users);
      }

   }, [users]); // Run this only when `features` changes
      
   const FilterByNameInput = (
      <Input
         placeholder="Search a user"
         value={value}
         onChange={e => {
            onSearch(e)
         }}
      />
   );


   return (
      <div className="col-md-9">
         <div className="card mb-4">
            <div className="card-header">
               <div className="card-title">
                  {FilterByNameInput}
               </div>
               {/* <button type="button" className="btn btn-outline-success breadcrumb float-sm-end">Add new</button> */}
            </div>

            <div className="card-body table-responsive p-0"></div>
            <Table
               dataSource={filteredFeatures}
               columns={columns}
               rowKey={"id"} />
         </div>
      </div>
   )
};

export default Users;
