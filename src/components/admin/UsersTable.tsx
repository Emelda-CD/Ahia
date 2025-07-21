
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllUsers, updateUserRole } from '@/lib/firebase/actions';
import type { UserProfile } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function UsersTable({ limit }: { limit?: number }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(limit ? allUsers.slice(0, limit) : allUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        variant: "destructive",
        title: "Could not load users",
        description: "There was an issue fetching user data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [limit, toast]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    setUpdatingUserId(userId);
    try {
        await updateUserRole(userId, newRole);
        setUsers(currentUsers =>
            currentUsers.map(u => u.uid === userId ? { ...u, role: newRole } : u)
        );
        toast({
            title: "User Role Updated",
            description: `User has been successfully made an ${newRole}.`
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not update the user's role.",
        });
    } finally {
        setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead className="text-center">Role</TableHead>
          <TableHead>Joined Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isUpdating = updatingUserId === user.uid;
          return (
          <TableRow key={user.uid}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.profileImage} data-ai-hint="person portrait" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              {user.role === 'admin' ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Admin
                </Badge>
              ) : (
                'User'
              )}
            </TableCell>
            <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}</TableCell>
            <TableCell className="text-right">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' ? (
                    <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'user')}>Demote to User</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'admin')}>Promote to Admin</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}
