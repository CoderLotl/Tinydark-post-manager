/**
 * Clase compuesta por varios métodos que instancian y devuelven elementos HTML.
 * La función de esta clase es proveer de métodos para una creación ágil de elementos
 * a la hora de tener que definir el HTML de manera dinámica. 
 * @export
 * @class DynamicDrawer
 */
export class DynamicDrawer
{
    /**     
     * Crea un div.
     * @param {string} [id=null]
     * @param {string} [htmlClass=null]
     * @return {HTMLElement} 
     * @memberof DynamicDrawer
     */
    CreateDiv(id = null, htmlClass = null)
    {
        let div = document.createElement('div');
        if(id)
        {
            div.id = id;
        }
        if(htmlClass)
        {
            div.className = htmlClass;
        }
        return div;
    }    

    /**     
     * Crea un input.
     * @param {string} id
     * @param {string} type
     * @param {string} [name=null]
     * @param {boolean} [required=false]
     * @return {HTMLElement} 
     * @memberof DynamicDrawer
     */
    CreateInput(id = null, type, name = null, required = false, value = null, htmlClass)
    {
        let input = document.createElement('input');
        input.type = type;
        if(id)
        {
            input.id = id;        
        }
        if(name)
        {
            input.name = name;
        }
        if(value)
        {
            input.value = value;
        }
        if(required)
        {
            input.required = true;
        }
        if(htmlClass)
        {
            input.className = htmlClass;
        }
        
        return input;
    }

    CreateLabel(text, id = null, forEl = null, iconClass = null)
    {
        let lbl = document.createElement('label');    
        if(id)
        {
            lbl.id = id;
        }
        if(iconClass)
        {
            let i = document.createElement('i');
            i.className = iconClass;
            lbl.appendChild(i);            
        }
        let textNode = document.createTextNode(text);
        lbl.appendChild(textNode);
        if(forEl)
        {
            lbl.htmlFor = forEl;
        }        

        return lbl;
    }

    CreateLegend(text, id = null, iconClass = null)
    {
        let lg = document.createElement('legend');
        if(id)
        {
            lg.id = id;
        }
        if(iconClass)
        {
            let i = document.createElement('i');
            i.className = iconClass;
            lg.appendChild(i);
        }
        let textNode = document.createTextNode(text);
        lg.appendChild(textNode);

        return lg;
    }
    
    CreateRange(id, min, max, value = null)
    {
        let rng = document.createElement('input');
        rng.id = id;
        rng.type = 'range';
        rng.min = min;
        rng.max = max;
        if (value !== null)
        {
            rng.value = value;
        }
        else
        {
            rng.value = min;
        }
    
        return rng;
    }

    CreateDropdown(id, options)
    {
        let dd = document.createElement('select');
        dd.id = id;
        
        for(let i = 0; i < options.length; i++)
        {
            let option = document.createElement('option');
            option.text = options[i];
            dd.add(option);
        }

        return dd;
    }    

    CreateButton(id, innerHTML)
    {
        let btn = document.createElement('button');
        btn.innerHTML = innerHTML;
        btn.id = id;

        return btn;
    }

    CreateSpan(id = null, textContent = null)
    {
        let span = document.createElement('span');
        if(id)
        {
            span.id = id;
        }
        span.textContent = textContent;
        return span;
    }

    CreateLink(rel, href)
    {
        let link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        return link;
    }

    CreateH(hSize, text, id = null, htmlClass = null)
    {
        let h = document.createElement(`h${hSize}`);
        if(id)
        {
            h.id = id;
        }
        if(htmlClass)
        {
            h.className = htmlClass;
        }
        h.textContent = text;
        return h;
    }

    CreateHR(id = null, htmlClass = null)
    {
        let hr = document.createElement('hr');
        if(id)
        {
            hr.id = id;
        }
        if(htmlClass)
        {
            hr.className = htmlClass;
        }
        return hr;
    }
}