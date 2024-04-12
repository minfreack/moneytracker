import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { SocketContext } from "@/context";
import { AuthContext } from "@/context/auth";
import dayjs from "dayjs";

type NewIncome = {
  amount: number,
  date: number | null
  type: string,
  category: string;
}

export const IncomeModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {

    const {socket} = useContext(SocketContext);

    const {userAuth} = useContext(AuthContext)

    const [incomeData, setIncomeData] = useState<NewIncome>({
      amount: 0,
      date: null,
      type: 'income',
      category: 'Income'
    })
    
    const onSubmit = () => {
      if(incomeData?.amount <= 0){
        return toast.error('No puedes añadir un ingreso menor o igual a 0 😢')
      }
      if(!incomeData?.date){
        return toast.error('Es necesario añadir la fecha')
      }
      socket.emit('new-transaction', {
          userID: userAuth?.auth?.uid,
          transactionData: incomeData
      })
      onClose()
    }    

    return (
        <Modal onClose={onClose} isOpen={isOpen} >
        <ModalContent>
              <ModalHeader className="flex flex-col gap-1">Añadir ingreso</ModalHeader>
              <ModalBody>
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
                    onChange={(e) => setIncomeData({...incomeData, amount: parseInt(e.target.value,10)})}
                />
                <Input
                      type="date"
                      className=""
                      placeholder="01/11/1999"
                      label='Fecha'
                      labelPlacement="outside"
                      onChange={(e) => setIncomeData({...incomeData, date: dayjs(e.target.value)?.valueOf()})}        
                  />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button onClick={onSubmit} color="primary">
                  Añadir ingreso
                </Button>
              </ModalFooter>
        </ModalContent>
      </Modal>
    )
}