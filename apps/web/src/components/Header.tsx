import { useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { CreatePatientDialog } from '@/components/patient/CreatePatientDialog'
import { ClinicSelector } from '@/components/header/ClinicSelector'
import { HeaderPatientSearch } from '@/components/header/HeaderPatientSearch'
import { UserMenu } from '@/components/header/UserMenu'

export function Header() {
  const { session } = useAuth()
  const [isCreatePatientDialogOpen, setIsCreatePatientDialogOpen] = useState(false)

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          
          {session && (
            <>
              <ClinicSelector />
              <HeaderPatientSearch />
              <Button
                onClick={() => setIsCreatePatientDialogOpen(true)}
                size="sm"
                className="h-9 w-9 p-0"
                title="Create Patient"
              >
                <CirclePlus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <UserMenu />
      </div>

      {/* Create Patient Dialog */}
      <CreatePatientDialog
        open={isCreatePatientDialogOpen}
        onOpenChange={setIsCreatePatientDialogOpen}
      />
    </header>
  )
}
