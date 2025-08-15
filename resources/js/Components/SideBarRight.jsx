import React from 'react'
import Card from './ui/Card'

function SideBarRight() {
  return (
   <aside>
       <Card className=" m-4 lg:w-80  border border-base-300">
                <div className="card p-4 shadow-lg">
                    <h3 className="text-sm font-semibold text-primary mb-3">Highlights</h3>
                    <div className="space-y-2">
                        <div className="text-xs text-accent font-medium">#GTB ULTRA 2025</div>
                        <div className="text-xs text-muted-foreground">#detikcourse</div>
                        <div className="text-xs text-muted-foreground">#DWP 2025</div>
                        <div className="text-xs text-muted-foreground">#Indonesia Future of Learning Summit (IFLS) 2025</div>
                        <div className="text-xs text-muted-foreground">#Detikcourse X SIB Mandiri</div>
                    </div>
                </div>
            </Card>
   </aside>
  )
}

export default SideBarRight;