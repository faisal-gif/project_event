import React from 'react'
import Card from './ui/Card'

function SideBarRight() {
  return (
   <aside>
        <Card className=" m-4 lg:w-80  border border-base-300">
            <div className="card p-4 shadow-lg">
                <h3 className="text-sm font-semibold text-primary mb-3">Event Popular</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Webinar</p>
                        <h4 className="text-sm font-semibold">Belajar AI dari Dasar</h4>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Workshop</p>
                        <h4 className="text-sm font-semibold">Full-Stack Web Development dengan Laravel & React</h4>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Seminar</p>
                        <h4 className="text-sm font-semibold">Peluang Karir di Dunia IT 2025</h4>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Talkshow</p>
                        <h4 className="text-sm font-semibold">Ngobrol Santai dengan Praktisi IT</h4>
                    </div>
                </div>
            </div>
        </Card>
   </aside>
  )
}

export default SideBarRight;