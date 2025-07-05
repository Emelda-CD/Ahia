
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminUsers } from '@/lib/admin-data';
import { MoreHorizontal, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersTable({ limit }: { limit?: number }) {
  const users = limit ? adminUsers.slice(0, limit) : adminUsers;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead className="text-center">Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} data-ai-hint={user.data_ai_hint} />
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
            <TableCell>
              <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}
               className={user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.joinDate}</TableCell>
            <TableCell className="text-right">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  {user.role === 'admin' ? (
                    <DropdownMenuItem>Demote to User</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>Promote to Admin</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {user.status === 'Active' ? (
                     <DropdownMenuItem><UserX className="mr-2 h-4 w-4" />Suspend User</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem><UserCheck className="mr-2 h-4 w-4" />Unsuspend User</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
