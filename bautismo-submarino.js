(function () {
    const whatsappBase = "https://wa.me/56923809564";
    const defaultMessage = "Hola Deep Xperiences, quiero más información sobre el Bautismo Submarino en Pichidangui.";

    const menuButton = document.querySelector(".landing-nav__toggle");
    const menu = document.querySelector(".landing-nav__links");
    const brandImage = document.querySelector(".landing-nav__brand img");

    if (brandImage) {
        brandImage.addEventListener("error", () => {
            brandImage.hidden = true;
        });
    }

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    const makeWhatsAppUrl = (message) => `${whatsappBase}?text=${encodeURIComponent(message || defaultMessage)}`;

    document.querySelectorAll('a[href^="https://wa.me/56923809564"]').forEach((link) => {
        link.href = makeWhatsAppUrl(defaultMessage);
    });

    document.querySelectorAll("[data-gallery-carousel]").forEach((carousel) => {
        const track = carousel.querySelector("[data-gallery-track]");
        const previousButton = carousel.querySelector("[data-gallery-prev]");
        const nextButton = carousel.querySelector("[data-gallery-next]");
        const counter = carousel.querySelector("[data-gallery-counter]");
        const slides = track ? Array.from(track.children) : [];
        let currentSlide = 0;

        const updateCarousel = () => {
            if (!track || slides.length === 0) {
                return;
            }

            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${slides.length}`;
            }

            if (previousButton) {
                previousButton.disabled = currentSlide === 0;
            }

            if (nextButton) {
                nextButton.disabled = currentSlide === slides.length - 1;
            }
        };

        if (previousButton) {
            previousButton.addEventListener("click", () => {
                currentSlide = Math.max(0, currentSlide - 1);
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                currentSlide = Math.min(slides.length - 1, currentSlide + 1);
                updateCarousel();
            });
        }

        updateCarousel();
    });

    const form = document.getElementById("bautismo-form");
    const status = document.getElementById("form-status");

    const emailConfig = {
        publicKey: "6IiDwhK_bmdHp7u3d",
        serviceId: "service_siovfrr",
        userTemplate: "template_user_confirmati",
        adminTemplate: "template_admin_notificat",
    };

    if (window.emailjs && emailConfig.publicKey) {
        window.emailjs.init(emailConfig.publicKey);
    }

    const setStatus = (message) => {
        if (status) {
            status.textContent = message;
        }
    };

    const getFormData = () => {
        const data = new FormData(form);
        return {
            nombre: String(data.get("nombre") || "").trim(),
            telefono: String(data.get("whatsapp") || "").trim(),
            email: String(data.get("email") || "").trim(),
            fecha_preferida: String(data.get("fecha") || "").trim(),
            num_personas: String(data.get("personas") || "").trim(),
            comentarios: String(data.get("mensaje") || "").trim(),
            certificacion_buceo: "Sin experiencia previa",
            intereses: "Bautismo Submarino en Pichidangui",
            destino_preferido: "Pichidangui",
            presupuesto_estimado: "Desde $100.000 por persona",
            pais: "Chile",
        };
    };

    const buildLeadMessage = (lead) => [
        defaultMessage,
        "",
        `Nombre: ${lead.nombre}`,
        `WhatsApp: ${lead.telefono}`,
        `Email: ${lead.email}`,
        `Fecha tentativa: ${lead.fecha_preferida || "Por definir"}`,
        `Personas: ${lead.num_personas || "Por definir"}`,
        lead.comentarios ? `Mensaje: ${lead.comentarios}` : "",
    ].filter(Boolean).join("\n");

    const validate = () => {
        const requiredFields = form.querySelectorAll("[required]");
        let isValid = true;

        requiredFields.forEach((field) => {
            const value = field.value.trim();
            field.removeAttribute("aria-invalid");

            if (!value || (field.type === "email" && !field.validity.valid)) {
                field.setAttribute("aria-invalid", "true");
                isValid = false;
            }
        });

        return isValid;
    };

    const sendEmail = async (lead) => {
        if (!window.emailjs) {
            throw new Error("EmailJS no está disponible");
        }

        const templateParams = {
            to_email: lead.email,
            user_name: lead.nombre,
            user_email: lead.email,
            user_phone: lead.telefono,
            telefono: lead.telefono,
            fecha_preferida: lead.fecha_preferida || "No especificada",
            fecha_alternativa: "Sin fecha alternativa",
            flexibilidad: "Flexible según condiciones del mar",
            num_personas: lead.num_personas || "1",
            certificacion_buceo: lead.certificacion_buceo,
            presupuesto_estimado: lead.presupuesto_estimado,
            pais: lead.pais,
            codigo_pais: "+56",
            intereses: lead.intereses,
            destino_preferido: lead.destino_preferido,
            comentarios: lead.comentarios || "Sin comentarios",
            current_year: new Date().getFullYear(),
            current_date: new Date().toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            submission_date: new Date().toLocaleString("es-CL"),
            message_preview: `Nueva solicitud Bautismo Submarino: ${lead.nombre} - ${lead.fecha_preferida || "Sin fecha"} - ${lead.num_personas || "1"} personas`,
            cc_email: "joaquinurzuad@gmail.com",
        };

        await Promise.all([
            window.emailjs.send(emailConfig.serviceId, emailConfig.userTemplate, templateParams),
            window.emailjs.send(emailConfig.serviceId, emailConfig.adminTemplate, {
                ...templateParams,
                to_email: "info@deepxperience.cl",
            }),
        ]);
    };

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!validate()) {
                setStatus("Revisa los campos marcados antes de enviar.");
                return;
            }

            const lead = getFormData();
            window.open(makeWhatsAppUrl(buildLeadMessage(lead)), "_blank", "noopener");
            setStatus("Abrimos WhatsApp con tu solicitud. También intentaremos enviar el respaldo por email.");

            try {
                await sendEmail(lead);
                form.reset();
                setStatus("Solicitud enviada. Te contactaremos pronto por WhatsApp.");
            } catch (error) {
                setStatus("WhatsApp quedó listo para enviar. Si no se abrió, usa el botón fijo de reserva.");
            }
        });
    }
})();
