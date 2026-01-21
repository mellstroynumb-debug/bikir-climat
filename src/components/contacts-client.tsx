'use client';

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { RegionSwitcher } from "./region-switcher";

const contactDetails = {
    PMR: {
        phone: '+373 777 12345',
        email: 'info.pmr@bikir-climat.com',
        address: 'г. Тирасполь, ул. 25 Октября, 100',
    },
    MD: {
        phone: '+373 68 123456',
        email: 'info.md@bikir-climat.com',
        address: 'mun. Chișinău, str. Arborilor, 21',
    }
}

export function ContactsClient() {
    const { region } = useStore();
    const details = contactDetails[region];

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Наша информация</CardTitle>
                    <RegionSwitcher />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={region}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center">
                            <Phone className="h-6 w-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold text-lg">{details.phone}</p>
                                <p className="text-sm text-muted-foreground">Телефон</p>
                            </div>
                        </div>
                         <div className="flex items-center">
                            <Mail className="h-6 w-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold text-lg">{details.email}</p>
                                <p className="text-sm text-muted-foreground">Электронная почта</p>
                            </div>
                        </div>
                         <div className="flex items-center">
                            <MapPin className="h-6 w-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold text-lg">{details.address}</p>
                                <p className="text-sm text-muted-foreground">Адрес</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-6 w-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold text-lg">Пн-Сб: 9:00 - 18:00</p>
                                <p className="text-sm text-muted-foreground">Часы работы</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
