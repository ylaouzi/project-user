import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Button } from "./components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./components/ui/dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Checkbox } from "./components/ui/checkbox"
import { toast } from "sonner"
import { Toaster } from "./components/ui/sonner"
import { Pencil, Trash2 } from "lucide-react"

type User = {
  uid: string
  name: string
  email: string
  phone: string
  address: string
  isActive: boolean
}

type UserFormData = Omit<User, 'uid'>

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      isActive: true
    }
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  // Set form values when editing a user
  useEffect(() => {
    if (currentUser && isEditing) {
      setValue("name", currentUser.name)
      setValue("email", currentUser.email)
      setValue("phone", currentUser.phone)
      setValue("address", currentUser.address)
      setValue("isActive", currentUser.isActive)
    }
  }, [currentUser, isEditing, setValue])

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err))
  }

  const openAddDialog = () => {
    setIsEditing(false)
    setCurrentUser(null)
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      isActive: true
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setIsEditing(true)
    setCurrentUser(user)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = (data: UserFormData) => {
    if (isEditing && currentUser) {
      // PUT request to update existing user
      axios.put(`http://localhost:5000/api/users/${currentUser.uid}`, data)
        .then(() => {
          fetchUsers()
          setIsDialogOpen(false)
          reset()
          toast.success("Utilisateur modifié avec succès")
        })
        .catch(err => {
          console.error("Error updating user:", err)
          toast.error("Une erreur est survenue lors de la modification de l'utilisateur")
        })
    } else {
      // POST request to create new user
      axios.post("http://localhost:5000/api/users", data)
        .then(() => {
          fetchUsers()
          setIsDialogOpen(false)
          reset()
          toast.success("Utilisateur ajouté avec succès")
        })
        .catch(err => {
          console.error("Error adding user:", err)
          toast.error("Une erreur est survenue lors de l'ajout de l'utilisateur")
        })
    }
  }

  const deleteUser = () => {
    if (currentUser) {
      axios.delete(`http://localhost:5000/api/users/${currentUser.uid}`)
        .then(() => {
          fetchUsers()
          setIsDeleteDialogOpen(false)
          setCurrentUser(null)
          toast.success("Utilisateur supprimé avec succès")
        })
        .catch(err => {
          console.error("Error deleting user:", err)
          toast.error("Une erreur est survenue lors de la suppression de l'utilisateur")
        })
    }
  }

  return (
    <div className="flex flex-col gap-4 p-16">
      <Toaster />
      <section className="p-20">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Liste d'utilisateurs</h1>
          <Button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={openAddDialog}
          >
            Ajouter un utilisateur
          </Button>
        </div>

        <div className="pt-8">
          <Table>
            <TableCaption>Liste des utilisateurs de la base de données.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.uid}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.isActive ? "Actif" : "Inactif"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openEditDialog(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openDeleteDialog(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* User Dialog Form for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier l'utilisateur" : "Ajouter un nouvel utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name" 
                {...register("name", { required: "Le nom est requis" })} 
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                {...register("email", { 
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide"
                  }
                })} 
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                {...register("phone", { required: "Le téléphone est requis" })} 
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                {...register("address", { required: "L'adresse est requise" })} 
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                {...register("isActive")} 
              />
              <Label htmlFor="isActive">Utilisateur actif</Label>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false)
                  reset()
                }}
              >
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog using regular Dialog instead of AlertDialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={deleteUser}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App