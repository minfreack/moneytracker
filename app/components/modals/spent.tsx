'use client'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteItem
} from "@nextui-org/autocomplete";
import { categories } from "@/utils/categories";
import { useContext, useState } from "react";
import { SocketContext } from "@/context";
import { AuthContext } from "@/context/auth";
import toast from "react-hot-toast";
import dayjs from "dayjs";

type NewSpent = {
  name: string;
  amount: number;
  date: number | null;
  type: string;
  category: string;
}

export const SpentModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {

    const {socket} = useContext(SocketContext);

    const {userAuth} = useContext(AuthContext)

    const [expenseData, setExpenseData] = useState<NewSpent>({
      name: '',
      amount: 0,
      date: null,
      type: 'expense',
      category: ''
    })

    const onSubmit = () => {
      if(!expenseData?.name){
        return toast.error('Es necesario saber el nombre del gasto')
      }
      if(expenseData?.amount <= 0){
        return toast.error('No puedes añadir un gasto menor o igual a 0 😢')
      }
      if(!expenseData?.date){
        return toast.error('Es necesario añadir la fecha')
      }
      if(!expenseData?.category){
        return toast.error('Es necesario añadir la categoría')
      }
      socket.emit('new-transaction', {
          userID: userAuth?.auth?.uid,
          transactionData: expenseData
      })
      onClose()
    }  


    return (
        <Modal onClose={onClose} isOpen={isOpen} >
        <ModalContent className="">
              <ModalHeader className="flex flex-col">Añadir gasto</ModalHeader>
              <ModalBody className="gap-y-4">
                <Input
                      type="text"
                      label="Gasto"
                      placeholder="Ingresa tu gasto"
                      labelPlacement="outside"
                      onChange={(e) => setExpenseData({...expenseData, name: e.target.value})}
                  />
                <Input
                      type="number"
                      label="Cantidad"
                      placeholder="0.00"
                      labelPlacement="outside"
                      endContent={
                          <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                          </div>
                      }
                      min={0}
                      onChange={(e) => setExpenseData({...expenseData, amount: parseInt(e.target.value,10)})}
                  />
                   <Input
                      type="date"
                      className=""
                      placeholder="01/11/1999"
                      label='Fecha'
                      labelPlacement="outside"    
                      onChange={(e) => setExpenseData({...expenseData, date: dayjs(e.target.value)?.valueOf()})}               
                  />
                  <Autocomplete 
                    label="Selecciona una categoría" 
                    labelPlacement="outside"
                    placeholder="Selecciona una categoría"
                    
                  >
                    {categories.map((category) => (
                      <AutocompleteItem onClick={() => setExpenseData({...expenseData, category: category?.value})} key={category.value} value={category.value}>
                        {category.label}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={onSubmit}>
                  Añadir gasto
                </Button>
              </ModalFooter>
        </ModalContent>
      </Modal>
    )
}